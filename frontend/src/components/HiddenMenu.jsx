import { useContext, useEffect, useRef, useState } from "react";
import UserContext from "../util/UserContext";
import Login from "./Login";
import { Link } from "react-router-dom";
import ThemeButton from "./ThemeButton";

function HiddenMenu({ isOpen, toggleLogin }) {
  const menuRef = useRef(null);
  const { user, logout } = useContext(UserContext);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
  }, [isOpen]);

  useEffect(() => {
    const clickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        if (
          document.getElementById("hiddenMenu").classList.contains("active") &&
          !event.target.classList.contains("loginIcon") &&
          !event.target.classList.contains("menu")
        ) {
          toggleLogin();
        }
      }
    };

    document.addEventListener("click", clickOutside);

    return () => {
      document.removeEventListener("click", clickOutside);
    };
  }, [menuRef, toggleLogin]);

  return (
    <div className="hiddenMenuCont" id="hiddenMenu">
      <div className="hiddenMenu" ref={menuRef}>
        <div className="innerMenu">
          <button className="closeButton" onClick={toggleLogin}>
            x
          </button>
          {!user ? (
            <Login toggleLogin={toggleLogin} />
          ) : (
            <div className="menuItems">
              <ul>
                <li>
                  <p>
                    Logged in as{" "}
                    <Link to={`/user/${user.user_name}`} onClick={toggleLogin}>
                      {user.user_name}
                    </Link>
                  </p>
                </li>

                <li>
                  <Link to="/mytemplates" onClick={toggleLogin}>
                    My templates
                  </Link>
                </li>
                <li>
                  <ThemeButton />
                </li>
                <li>
                  <Link onClick={logout}>Logout</Link>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default HiddenMenu;
