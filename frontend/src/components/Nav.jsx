import { NavLink } from "react-router-dom";
import ThemeButton from "./ThemeButton";
import { isLoggedIn } from "../util/permissions";
import logo from "../assets/logo.svg";
import Login from "./Login";
import { isMobile } from "react-device-detect";
import { useContext, useEffect } from "react";
import UserContext from "../util/UserContext";

function Nav() {
  const { user } = useContext(UserContext);
  useEffect(() => {
    console.log("user data updated");
  }, [user]);

  const toggleLogin = () => {
    document.getElementById("loginCont").classList.toggle("active");
    document.getElementById("navLogin").classList.toggle("active");
  };

  function Links() {
    return (
      <>
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
        {user && (
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
              {user ? "lock_open" : "lock"}
            </span>
            <span className="linkName loginIcon">
              {user ? "Logged in" : "Login"}
            </span>
          </div>
        </li>
      </>
    );
  }

  if (isMobile) {
    return (
      <>
        <nav className="mobile">
          <ul>
            <li>
              <NavLink to="/" id="logoCont">
                <img src={logo} id="logo" />
                <span>Listmaker 9000</span>
              </NavLink>
            </li>
          </ul>
        </nav>

        <div className="mobileNav">
          <Login isFixed={true} />
          <ul>
            <Links />
          </ul>
        </div>
      </>
    );
  }

  return (
    <nav>
      <ul>
        <li>
          <NavLink to="/" id="logoCont">
            <img src={logo} id="logo" />
            <span>Listmaker 9000</span>
          </NavLink>
        </li>
        <Links />
      </ul>
      <Login isFixed={true} />
    </nav>
  );
}

export default Nav;
