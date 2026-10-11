import { useEffect, useState } from "react";

function Dashboard() {
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/tournaments"
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error("Không thể tải danh sách giải đấu.");
        }

        const data = Array.isArray(result)
          ? result
          : result.data ?? result.tournaments ?? [];

        setTournaments(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTournaments();
  }, []);

  return (
    <div className="page">
      <h1>TFT Tournament Manager</h1>
      <p>Hệ thống quản lý giải đấu TFT</p>

      <h2>Chức năng chính</h2>

      <div className="form-card">
        <button
          className="primary-button"
          onClick={() => (window.location.href = "/create-tournament")}
        >
          Tạo giải đấu
        </button>

        <button onClick={() => (window.location.href = "/players")}>
          Quản lý người chơi
        </button>

        <button onClick={() => (window.location.href = "/bracket")}>
          Xem bảng đấu
        </button>

        <button onClick={() => (window.location.href = "/ranking")}>
          Xem xếp hạng
        </button>
      </div>

      <h2>Danh sách giải đấu</h2>

      {loading && <p>Đang tải danh sách giải đấu...</p>}

      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && !error && tournaments.length === 0 && (
        <p>Chưa có giải đấu nào. Hãy tạo giải đấu đầu tiên!</p>
      )}

      {!loading &&
        !error &&
        tournaments.map((tournament) => (
          <div className="form-card" key={tournament.id}>
            <h3>{tournament.name}</h3>
            <p>
              Số lượng người chơi:{" "}
              {tournament.playerCount ?? "Chưa cập nhật"}
            </p>
            <p>Trạng thái: {tournament.status ?? "Chưa xác định"}</p>
          </div>
        ))}
    </div>
  );
}

export default Dashboard;