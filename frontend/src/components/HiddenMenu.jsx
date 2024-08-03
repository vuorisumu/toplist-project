import { useContext, useEffect, useRef, useState } from "react";
import UserContext from "../util/UserContext";
import Login from "./Login";

function HiddenMenu({ isOpen, toggleLogin }) {
  const menuRef = useRef(null);

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
          <Login toggleLogin={toggleLogin} />
        </div>
      </div>
    </div>
  );
}

export default HiddenMenu;
