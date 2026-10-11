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

  const totalPlayerSlots = tournaments.reduce(
    (total, tournament) => total + (Number(tournament.playerCount) || 0),
    0
  );

  return (
    <div className="page dashboard-page">
      <header className="page-heading">
        <span className="eyebrow">TFT TOURNAMENT MANAGER</span>
        <h1>Tổng quan giải đấu</h1>
        <p>Quản lý giải đấu, người chơi và bảng đấu tại một nơi.</p>
      </header>

      <section className="dashboard-stats" aria-label="Thống kê giải đấu">
        <article className="stat-card">
          <span>Giải đấu</span>
          <strong>{loading ? "—" : tournaments.length}</strong>
          <small>Tổng số giải đấu trong hệ thống</small>
        </article>
        <article className="stat-card">
          <span>Sức chứa người chơi</span>
          <strong>{loading ? "—" : totalPlayerSlots}</strong>
          <small>Tổng chỉ tiêu từ các giải đấu</small>
        </article>
      </section>

      <section className="dashboard-section">
        <div className="section-heading">
          <h2>Truy cập nhanh</h2>
          <p>Các công cụ quản lý giải đấu</p>
        </div>
        <div className="dashboard-actions">
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
      </section>

      <section className="dashboard-section">
        <div className="section-heading">
          <h2>Danh sách giải đấu</h2>
          {!loading && !error && (
            <p>{tournaments.length} giải đấu</p>
          )}
        </div>

        {loading && (
          <p className="status-message" role="status">
            Đang tải danh sách giải đấu...
          </p>
        )}

        {error && (
          <p className="status-message status-message--error" role="alert">
            {error}
          </p>
        )}

        {!loading && !error && tournaments.length === 0 && (
          <p className="empty-state">
            Chưa có giải đấu nào. Hãy tạo giải đấu đầu tiên!
          </p>
        )}

        {!loading && !error && tournaments.length > 0 && (
          <div className="tournament-grid">
            {tournaments.map((tournament) => (
              <article className="tournament-card" key={tournament.id}>
                <h3>{tournament.name}</h3>
                <p>
                  <span>Số lượng người chơi</span>
                  <strong>{tournament.playerCount ?? "Chưa cập nhật"}</strong>
                </p>
                <p>
                  <span>Trạng thái</span>
                  <strong>{tournament.status ?? "Chưa xác định"}</strong>
                </p>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default Dashboard;