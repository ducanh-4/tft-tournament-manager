import { useState } from "react";

function CreateTournament() {
  const [name, setName] = useState("");
  const [playerCount, setPlayerCount] = useState("8");
  const [days, setDays] = useState("1");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      setError(true);
      setMessage("Vui lòng nhập tên giải đấu.");
      return;
    }

    setLoading(true);
    setMessage("");
    setError(false);

    try {
      const response = await fetch(
        "http://localhost:5000/api/tournaments",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: name.trim(),
            playerCount: Number(playerCount),
            days: Number(days),
          }),
        }
      );

      const result = await response.json();

      if (!response.ok || result.success === false) {
        throw new Error(
          result.message || "Không thể tạo giải đấu."
        );
      }

      setMessage("Tạo giải đấu thành công!");
      setName("");
      setPlayerCount("8");
      setDays("1");
    } catch (err) {
      setError(true);

      setMessage(
        err.message === "Failed to fetch"
          ? "Không kết nối được backend. Hãy kiểm tra server."
          : err.message
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <h1>Tạo giải đấu</h1>
      <p>Tạo một giải đấu TFT mới</p>

      <form className="form-card" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="tournament-name">
            Tên giải đấu
          </label>

          <input
            id="tournament-name"
            type="text"
            placeholder="Ví dụ: TFT Championship 2026"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="player-count">
            Số lượng người chơi
          </label>

          <select
            id="player-count"
            value={playerCount}
            onChange={(e) => setPlayerCount(e.target.value)}
          >
            <option value="8">8 người</option>
            <option value="16">16 người</option>
            <option value="32">32 người</option>
            <option value="64">64 người</option>
            <option value="128">128 người</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="tournament-days">
            Số ngày thi đấu
          </label>

          <select
            id="tournament-days"
            value={days}
            onChange={(e) => setDays(e.target.value)}
          >
            <option value="1">1 ngày</option>
            <option value="2">2 ngày</option>
            <option value="3">3 ngày</option>
          </select>
        </div>

        <button
          className="primary-button"
          type="submit"
          disabled={loading}
        >
          {loading ? "Đang tạo..." : "Tạo giải đấu"}
        </button>

        {message && (
          <p
            role="status"
            style={{
              color: error ? "#dc2626" : "#16a34a",
            }}
          >
            {message}
          </p>
        )}
      </form>
    </div>
  );
}

export default CreateTournament;