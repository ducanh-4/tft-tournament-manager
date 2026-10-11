import { useEffect, useState } from "react";

function Players() {
  const [name, setName] = useState("");
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);

  const fetchPlayers = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/players");
      const result = await response.json();

      if (!response.ok || result.success === false) {
        throw new Error(result.message || "Không tải được danh sách.");
      }

      setPlayers(result.data ?? []);
    } catch (err) {
      setError(true);
      setMessage(
        err.message === "Failed to fetch"
          ? "Không kết nối được backend."
          : err.message
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlayers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      setError(true);
      setMessage("Vui lòng nhập tên người chơi.");
      return;
    }

    setSubmitting(true);
    setMessage("");
    setError(false);

    try {
      const response = await fetch("http://localhost:5000/api/players", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          displayName: name.trim(),
        }),
      });

      const result = await response.json();

      if (!response.ok || result.success === false) {
        throw new Error(result.message || "Không thể thêm người chơi.");
      }

      setPlayers((current) => [
        ...current,
        result.data,
      ]);
      setName("");
      setMessage("Thêm người chơi thành công!");
    } catch (err) {
      setError(true);

      const messages = {
        "Player already exists": "Người chơi này đã tồn tại.",
        "Player display name is required": "Vui lòng nhập tên người chơi.",
        "Failed to fetch": "Không kết nối được backend.",
      };

      setMessage(messages[err.message] || err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page">
      <h1>Quản lý người chơi</h1>
      <p>Thêm và quản lý danh sách người chơi</p>

      <form className="form-card" onSubmit={handleSubmit}>
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

        {message && (
          <p
            role="status"
            style={{ color: error ? "#dc2626" : "#16a34a" }}
          >
            {message}
          </p>
        )}
      </form>

      <div className="list-card">
        <h2>Danh sách người chơi ({players.length})</h2>

        {loading ? (
          <p>Đang tải danh sách...</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>STT</th>
                <th>Tên người chơi</th>
                <th>Trạng thái</th>
              </tr>
            </thead>

            <tbody>
              {players.length === 0 ? (
                <tr>
                  <td colSpan="3">Chưa có người chơi nào.</td>
                </tr>
              ) : (
                players.map((player, index) => (
                  <tr key={player.id ?? index}>
                    <td>{index + 1}</td>
                    <td>
                      {player.displayName ?? player.name ?? "Chưa có tên"}
                    </td>
                    <td>Đã đăng ký</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default Players;