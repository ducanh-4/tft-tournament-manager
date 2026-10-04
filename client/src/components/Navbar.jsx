import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar">
      <Link to="/">Dashboard</Link>
      <Link to="/create-tournament">Tạo giải đấu</Link>
      <Link to="/players">Người chơi</Link>
      <Link to="/bracket">Bảng đấu</Link>
      <Link to="/ranking">Xếp hạng</Link>
    </nav>
  );
}

export default Navbar;