import { useState } from "react";
import { NavLink } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  const [open, setOpen] = useState(false);
  const closeMenu = () => setOpen(false);

  return (
    <nav className="navbar">
      <div className="nav-inner">
        <div className="nav-title">
          📊{" "}
          <span>
            <span className="ex">ex</span>
            <span className="pro">Pro</span>
          </span>
        </div>

        <button
          className={`nav-toggle ${open ? "open" : ""}`}
          aria-label="Toggle navigation"
          aria-expanded={open}
          aria-controls="nav-menu"
          onClick={() => setOpen(!open)}
        >
          <span className="bar" />
          <span className="bar" />
          <span className="bar" />
        </button>

        <ul className="nav-links desktop">
          <li>
            <NavLink
              to="/news"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              News
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/transcript"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              Transcript
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/economy"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              Economy
            </NavLink>
          </li>
        </ul>
      </div>

      {/* tap-to-close backdrop (mobile only) */}
      <div
        className={`nav-backdrop ${open ? "show" : ""}`}
        onClick={closeMenu}
      />

      <ul id="nav-menu" className={`nav-links mobile ${open ? "open" : ""}`}>
        <li>
          <NavLink
            to="/news"
            onClick={closeMenu}
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            News
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/transcript"
            onClick={closeMenu}
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Transcript
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/economy"
            onClick={closeMenu}
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Economy
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
