import { NavLink } from "react-router-dom";
import ThemeButton from "./ThemeButton";
import { isLoggedIn } from "../util/permissions";
import logo from "../assets/logo.svg";
import Login from "./Login";

function Nav() {
  const toggleLogin = () => {
    document.getElementById("loginCont").classList.toggle("active");
    document.getElementById("navLogin").classList.toggle("active");
  };

  return (
    <nav>
      <ul>
        <li>
          <NavLink to="/" id="logoCont">
            <img src={logo} id="logo" />
            <span>Listmaker 9000</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/templates">
            <span className="material-symbols-outlined icon">view_list</span>
            <span className="linkName">Templates</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/toplists">
            <span className="material-symbols-outlined icon">
              format_list_numbered
            </span>
            <span className="linkName">Top lists</span>
          </NavLink>
        </li>
        {isLoggedIn() && (
          <li>
            <NavLink to="/new-template">
              <span className="material-symbols-outlined icon">
                list_alt_add
              </span>
              <span className="linkName">New template</span>
            </NavLink>
          </li>
        )}
        <li>
          <ThemeButton />
        </li>
        <li>
          <div
            className="toggleLogin loginIcon"
            onClick={toggleLogin}
            id="navLogin"
          >
            <span className="material-symbols-outlined icon loginIcon">
              {isLoggedIn() ? "lock_open" : "lock"}
            </span>
            <span className="linkName loginIcon">
              {isLoggedIn() ? "Logged in" : "Login"}
            </span>
          </div>
        </li>
      </ul>
      <Login isFixed={true} />
    </nav>
  );
}

export default Nav;
