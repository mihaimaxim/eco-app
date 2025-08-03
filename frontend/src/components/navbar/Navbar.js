import { NavLink } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="nav-title">📊 EconTools</div>
      <ul className="nav-links">
        <li>
          <NavLink to="/news" activeclassname="active">
            News
          </NavLink>
        </li>
        <li>
          <NavLink to="/transcript" activeclassname="active">
            Transcript
          </NavLink>
        </li>
        <li>
          <NavLink to="/labor" activeclassname="active">
            Labor
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
