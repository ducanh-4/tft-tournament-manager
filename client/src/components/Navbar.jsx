import { Link, NavLink } from "react-router-dom";

function Navbar() {
  const navigation = [
    { to: "/", number: "01", label: "Tổng quan", end: true },
    { to: "/create-tournament", number: "02", label: "Tạo giải đấu" },
    { to: "/players", number: "03", label: "Người chơi" },
    { to: "/bracket", number: "04", label: "Bảng đấu" },
    { to: "/ranking", number: "05", label: "Xếp hạng" },
  ];

  return (
    <nav className="navbar">
      <Link className="brand" to="/" aria-label="TFT Arena, về tổng quan">
        <span className="brand-mark">TFT</span>
        <span className="brand-copy">
          <strong>TFT Arena</strong>
          <span>Tournament Manager</span>
        </span>
      </Link>

      <span className="sidebar-caption">Không gian giải đấu</span>
      <div className="nav-links">
        {navigation.map(({ to, number, label, end }) => (
          <NavLink
            key={to}
            className={({ isActive }) =>
              `nav-link${isActive ? " active" : ""}`
            }
            to={to}
            end={end}
          >
            <span className="nav-index" aria-hidden="true">
              {number}
            </span>
            <span>{label}</span>
          </NavLink>
        ))}
      </div>

      <div className="sidebar-footer">
        <strong>Quản lý giải đấu TFT</strong>
        Tổ chức. Thi đấu. Vinh danh.
      </div>
    </nav>
  );
}

export default Navbar;