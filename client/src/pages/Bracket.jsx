
import { useEffect, useState } from "react";

const API = "http://localhost:5000/api";

function Bracket() {
  const [tournaments, setTournaments] = useState([]);
  const [tournamentId, setTournamentId] = useState("");
  const [round, setRound] = useState(null);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const notify = (text, error = false) => {
    setMessage(text);
    setIsError(error);
  };

  useEffect(() => {
    async function loadTournaments() {
      try {
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
          setTournamentId(String(data[0].id));
        }
      } catch (error) {
        notify(error.message, true);
      } finally {
        setLoading(false);
      }
    }

    loadTournaments();
  }, []);

  async function handleCreateRound() {
    if (!tournamentId) {
      notify("Hãy chọn giải đấu trước.", true);
      return;
    }

    setCreating(true);
    setRound(null);
    notify("");

    try {
      const response = await fetch(
        `${API}/tournaments/${tournamentId}/rounds`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        }
      );

      const result = await response.json();

      if (!response.ok || result.success === false) {
        const messages = {
          "Registered player count does not match tournament player count":
            "Số người đăng ký chưa khớp với số lượng người chơi của giải.",
          "Tournament not found": "Không tìm thấy giải đấu.",
        };

        throw new Error(
          messages[result.message] ||
            result.message ||
            "Không thể tạo vòng đấu."
        );
      }

      setRound(result.data);
      notify("Tạo vòng đấu thành công!");
    } catch (error) {
      notify(
        error.message === "Failed to fetch"
          ? "Không kết nối được backend."
          : error.message,
        true
      );
    } finally {
      setCreating(false);
    }
  }

  const selectedTournament = tournaments.find(
    (item) => String(item.id) === tournamentId
  );

  const roundData = round
    ? round.round ?? round
    : null;

  const lobbies =
    roundData?.lobbies ??
    roundData?.groups ??
    roundData?.tables ??
    [];

  function getLobbyPlayers(lobby) {
    return (
      lobby.players ??
      lobby.tournamentPlayers ??
      lobby.registrations ??
      []
    );
  }

  function getPlayerName(item) {
    return (
      item.player?.displayName ??
      item.player?.name ??
      item.displayName ??
      item.name ??
      `Người chơi #${item.playerId ?? item.id ?? "?"}`
    );
  }

  return (
    <div className="page">
      <h1>Bảng đấu TFT</h1>
      <p>Quản lý vòng đấu và các lobby</p>

      <div className="form-card">
        <div className="form-group">
          <label htmlFor="bracket-tournament">Chọn giải đấu</label>
          <select
            id="bracket-tournament"
            value={tournamentId}
            onChange={(event) => {
              setTournamentId(event.target.value);
              setRound(null);
              notify("");
            }}
            disabled={loading || creating}
          >
            <option value="">-- Chọn giải đấu --</option>
            {tournaments.map((tournament) => (
              <option key={tournament.id} value={tournament.id}>
                {tournament.name}
              </option>
            ))}
          </select>
        </div>

        <button
          className="primary-button"
          onClick={handleCreateRound}
          disabled={!tournamentId || loading || creating}
        >
          {creating ? "Đang tạo vòng đấu..." : "Tạo vòng đấu"}
        </button>

        {loading && <p>Đang tải danh sách giải đấu...</p>}

        {!loading && tournaments.length === 0 && (
          <p>Chưa có giải đấu. Hãy tạo giải trước.</p>
        )}

        {message && (
          <p
            role="status"
            style={{ color: isError ? "#dc2626" : "#16a34a" }}
          >
            {message}
          </p>
        )}
      </div>

      {roundData && (
        <>
          <div className="round-header">
            <div>
              <h2>
                {roundData.name ??
                  `Round ${roundData.roundNumber ?? roundData.number ?? 1}`}
              </h2>
              <p>{selectedTournament?.name}</p>
            </div>

            <strong>
              {roundData.playerCount ??
                selectedTournament?.playerCount ??
                "—"}{" "}
              người chơi
            </strong>
          </div>

          {lobbies.length > 0 ? (
            <div className="lobby-grid">
              {lobbies.map((lobby, index) => {
                const players = getLobbyPlayers(lobby);

                return (
                  <div
                    className="lobby-card"
                    key={lobby.id ?? index}
                  >
                    <h3>
                      {lobby.name ?? `Lobby ${lobby.lobbyNumber ?? index + 1}`}
                    </h3>

                    <p>{players.length} người chơi</p>

                    {players.length > 0 ? (
                      <ol>
                        {players.map((player, playerIndex) => (
                          <li
                            key={
                              player.id ??
                              player.playerId ??
                              playerIndex
                            }
                          >
                            {getPlayerName(player)}
                          </li>
                        ))}
                      </ol>
                    ) : (
                      <p>
                        Backend chưa trả về danh sách người chơi của lobby.
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <p>
              Vòng đấu đã được tạo, nhưng cần đối chiếu cấu trúc dữ liệu
              backend để hiển thị chính xác các lobby.
            </p>
          )}
        </>
      )}
    </div>
  );
}

export default Bracket;
