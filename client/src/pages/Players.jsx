import { useEffect, useState } from "react";

const API = "http://localhost:5000/api";

function Players() {
  const [name, setName] = useState("");
  const [players, setPlayers] = useState([]);
  const [tournaments, setTournaments] = useState([]);
  const [selectedTournament, setSelectedTournament] = useState("");
  const [registeredPlayers, setRegisteredPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [registering, setRegistering] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);

  const showMessage = (text, isError = false) => {
    setMessage(text);
    setError(isError);
  };

  const fetchPlayers = async () => {
    const response = await fetch(`${API}/players`);
    const result = await response.json();

    if (!response.ok || result.success === false) {
      throw new Error(result.message || "Không tải được người chơi.");
    }

    setPlayers(result.data ?? []);
  };

  const fetchTournaments = async () => {
    const response = await fetch(`${API}/tournaments`);
    const result = await response.json();

    if (!response.ok || result.success === false) {
      throw new Error(result.message || "Không tải được giải đấu.");
    }

    const data = Array.isArray(result)
      ? result
      : result.data ?? result.tournaments ?? [];

    setTournaments(data);

    if (data.length > 0) {
      setSelectedTournament((current) => current || String(data[0].id));
    }
  };

  const fetchRegisteredPlayers = async (tournamentId) => {
    if (!tournamentId) {
      setRegisteredPlayers([]);
      return;
    }

    const response = await fetch(
      `${API}/tournaments/${tournamentId}/players`
    );
    const result = await response.json();

    if (!response.ok || result.success === false) {
      throw new Error(
        result.message || "Không tải được danh sách đăng ký."
      );
    }

    setRegisteredPlayers(result.data ?? []);
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        await Promise.all([fetchPlayers(), fetchTournaments()]);
      } catch (err) {
        showMessage(err.message, true);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    if (!selectedTournament) {
      setRegisteredPlayers([]);
      return;
    }

    fetchRegisteredPlayers(selectedTournament).catch((err) => {
      showMessage(err.message, true);
    });
  }, [selectedTournament]);

  const handleAddPlayer = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      showMessage("Vui lòng nhập tên người chơi.", true);
      return;
    }

    setSubmitting(true);
    showMessage("");

    try {
      const response = await fetch(`${API}/players`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ displayName: name.trim() }),
      });

      const result = await response.json();

      if (!response.ok || result.success === false) {
        throw new Error(result.message || "Không thể thêm người chơi.");
      }

      setPlayers((current) => [...current, result.data]);
      setName("");
      showMessage("Thêm người chơi thành công!");
    } catch (err) {
      const messages = {
        "Player already exists": "Người chơi này đã tồn tại.",
        "Player display name is required": "Vui lòng nhập tên người chơi.",
        "Failed to fetch": "Không kết nối được backend.",
      };

      showMessage(messages[err.message] || err.message, true);
    } finally {
      setSubmitting(false);
    }
  };

  const handleRegister = async (playerId) => {
    if (!selectedTournament) {
      showMessage("Hãy tạo giải đấu trước khi đăng ký người chơi.", true);
      return;
    }

    setRegistering(true);
    showMessage("");

    try {
      const response = await fetch(
        `${API}/tournaments/${selectedTournament}/players`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ playerId }),
        }
      );

      const result = await response.json();

      if (!response.ok || result.success === false) {
        throw new Error(result.message || "Đăng ký thất bại.");
      }

      await fetchRegisteredPlayers(selectedTournament);
      showMessage("Đăng ký người chơi vào giải thành công!");
    } catch (err) {
      const messages = {
        "Player already registered": "Người chơi đã đăng ký giải này.",
        "Tournament is full": "Giải đấu đã đủ số lượng người chơi.",
        "Tournament not found": "Không tìm thấy giải đấu.",
        "Player not found": "Không tìm thấy người chơi.",
        "Failed to fetch": "Không kết nối được backend.",
      };

      showMessage(messages[err.message] || err.message, true);
    } finally {
      setRegistering(false);
    }
  };

  const getPlayerName = (registration) =>
    registration.player?.displayName ??
    registration.displayName ??
    registration.player?.name ??
    registration.name ??
    `Người chơi #${registration.playerId ?? registration.id}`;

  const registeredIds = new Set(
    registeredPlayers.map((registration) =>
      Number(registration.playerId ?? registration.player?.id)
    )
  );

  return (
    <div className="page">
      <header className="page-heading">
        <span className="eyebrow">ĐỘI HÌNH THI ĐẤU</span>
        <h1>Quản lý người chơi</h1>
        <p>Thêm người chơi và đăng ký vào giải đấu</p>
      </header>

      <form className="form-card" onSubmit={handleAddPlayer}>
        <div className="form-group">
          <label htmlFor="player-name">Tên người chơi</label>
          <input
            id="player-name"
            type="text"
            placeholder="Nhập tên người chơi"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <button
          className="primary-button"
          type="submit"
          disabled={submitting}
        >
          {submitting ? "Đang thêm..." : "Thêm người chơi"}
        </button>
      </form>

      <div className="form-card">
        <h2>Đăng ký người chơi vào giải</h2>

        <div className="form-group">
          <label htmlFor="tournament-select">Chọn giải đấu</label>
          <select
            id="tournament-select"
            value={selectedTournament}
            onChange={(e) => setSelectedTournament(e.target.value)}
          >
            <option value="">-- Chọn giải đấu --</option>
            {tournaments.map((tournament) => (
              <option key={tournament.id} value={tournament.id}>
                {tournament.name}
              </option>
            ))}
          </select>
        </div>

        {!loading && tournaments.length === 0 && (
          <p className="empty-state">Chưa có giải đấu. Hãy tạo giải trước.</p>
        )}

        <h3>Danh sách người chơi ({players.length})</h3>

        {loading ? (
          <p className="status-message" role="status">
            Đang tải dữ liệu...
          </p>
        ) : players.length === 0 ? (
          <p className="empty-state">Chưa có người chơi nào.</p>
        ) : (
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>STT</th>
                  <th>Tên người chơi</th>
                  <th>Trạng thái</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {players.map((player, index) => {
                  const isRegistered = registeredIds.has(Number(player.id));

                  return (
                    <tr key={player.id}>
                      <td>{index + 1}</td>
                      <td>{player.displayName ?? player.name}</td>
                      <td>
                        <span
                          className={`status-pill ${
                            isRegistered ? "status-pill--registered" : ""
                          }`}
                        >
                          {isRegistered ? "Đã đăng ký" : "Chưa đăng ký"}
                        </span>
                      </td>
                      <td>
                        <button
                          type="button"
                          disabled={
                            !selectedTournament ||
                            isRegistered ||
                            registering
                          }
                          onClick={() => handleRegister(Number(player.id))}
                        >
                          {isRegistered ? "Đã đăng ký" : "Đăng ký"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="list-card">
        <h2>
          Người chơi đã đăng ký ({registeredPlayers.length})
        </h2>

        {!selectedTournament ? (
          <p className="empty-state">Hãy chọn một giải đấu.</p>
        ) : registeredPlayers.length === 0 ? (
          <p className="empty-state">Chưa có người chơi đăng ký giải này.</p>
        ) : (
          <ol className="registered-list">
            {registeredPlayers.map((registration, index) => (
              <li key={registration.id ?? registration.playerId ?? index}>
                {getPlayerName(registration)}
              </li>
            ))}
          </ol>
        )}
      </div>

      {message && (
        <p
          role="status"
          className={`status-message ${
            error ? "status-message--error" : "status-message--success"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
}

export default Players;