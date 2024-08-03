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
        console.log("click");
        if (
          document.getElementById("hiddenMenu").classList.contains("active") &&
          !event.target.classList.contains("loginIcon")
        ) {
          toggleLogin();
        }
      }
    };

    document.addEventListener("click", clickOutside);

    return () => {
      document.removeEventListener("click", clickOutside);
    };
  }, [menuRef]);

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
              <p>
                Logged in as{" "}
                <Link to={`/user/${user.user_name}`}>{user.user_name}</Link>
              </p>

              <ThemeButton />

              <button className="logoutButton" onClick={logout}>
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default HiddenMenu;
