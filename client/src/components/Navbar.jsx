import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        <span className="brand-icon">⚔</span>
        <span className="brand-text">MTG Deck Creator</span>
      </Link>
      <div className="navbar-links">
        <Link
          to="/"
          className={`nav-link ${location.pathname === "/" ? "active" : ""}`}
        >
          My Decks
        </Link>
        <Link
          to="/mana-symbols"
          className={`nav-link ${location.pathname === "/mana-symbols" ? "active" : ""}`}
        >
          Mana Art
        </Link>
      </div>
    </nav>
  );
}
