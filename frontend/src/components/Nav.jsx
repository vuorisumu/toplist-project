import { NavLink } from "react-router-dom";
import ThemeButton from "./ThemeButton";
import { isLoggedIn } from "../util/permissions";
import logo from "../assets/logo.svg";
import Login from "./Login";
import { isMobile } from "react-device-detect";
import { useContext, useEffect, useState } from "react";
import UserContext from "../util/UserContext";
import HiddenMenu from "./HiddenMenu";
import SearchBar from "./SearchBar";

function Nav() {
  const { user } = useContext(UserContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    console.log("user data updated");
  }, [user]);

  const toggleLogin = () => {
    setMenuOpen(!menuOpen);
    document.getElementById("hiddenMenu").classList.toggle("active");
    // document.getElementById("loginCont").classList.toggle("active");
    // document.getElementById("navLogin").classList.toggle("active");
  };

  const toggleSearch = () => {
    setSearchOpen(!searchOpen);
    document.getElementById("searchBar").classList.toggle("active");
  };

  function Links() {
    return (
      <>
        <li>
          <NavLink to="/categories">
            <span className="material-symbols-outlined icon">view_list</span>
            <span className="linkName">Categories</span>
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
            <li id="searchBar" className={searchOpen ? "active" : ""}>
              <SearchBar isOpen={searchOpen} toggleSearch={toggleSearch} />
            </li>
          </ul>
        </nav>

        <div className="mobileNav">
          <ul>
            <Links />
          </ul>
        </div>

        <HiddenMenu isOpen={menuOpen} toggleLogin={toggleLogin} />
      </>
    );
  }

  return (
    <>
      <nav>
        <ul>
          <li>
            <NavLink to="/" id="logoCont">
              <img src={logo} id="logo" />
              <span>Listmaker 9000</span>
            </NavLink>
          </li>
          <li id="searchBar" className={searchOpen ? "active" : ""}>
            <SearchBar isOpen={searchOpen} toggleSearch={toggleSearch} />
          </li>
          <Links />
        </ul>
      </nav>
      <HiddenMenu isOpen={menuOpen} toggleLogin={toggleLogin} />
    </>
  );
}

export default Nav;
