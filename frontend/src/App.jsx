import React from "react";
import { HashRouter as Router, Routes, Route, NavLink } from "react-router-dom";
import "./App.css";
import Main from "./components/Main.jsx";
import NewTemplate from "./components/NewTemplate.jsx";
import Login from "./components/Login.jsx";
import EditTemplate from "./components/EditTemplate.jsx";
import BrowseToplists from "./components/BrowseToplists.jsx";
import Ranking from "./components/Ranking.jsx";
import BrowseTemplates from "./components/BrowseTemplates.jsx";
import { checkCreatorStatus } from "./components/util.js";
import logo from "./assets/logo.svg";
import ThemeButton from "./components/ThemeButton.jsx";
import NewList from "./components/NewList.jsx";

class App extends React.Component {
  constructor(props) {
    super(props);

    this.handleKeyPress = this.handleKeyPress.bind(this);
  }

  componentDidMount() {
    document.addEventListener("keydown", this.handleKeyPress);
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.handleKeyPress);
  }

  handleKeyPress(e) {
    if (
      e.key === "Backspace" &&
      document.activeElement.tagName !== "INPUT" &&
      document.activeElement.tagName !== "TEXTAREA"
    ) {
      window.history.back();
    }
  }

  render() {
    const toggleLogin = () => {
      document.getElementById("loginCont").classList.toggle("active");
      document.getElementById("navLogin").classList.toggle("active");
    };

    return (
      <Router>
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
                <span className="material-symbols-outlined icon">
                  view_list
                </span>
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
            {checkCreatorStatus() && (
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
              <div className="toggleLogin" onClick={toggleLogin} id="navLogin">
                <span className="material-symbols-outlined icon">
                  {checkCreatorStatus() ? "lock_open" : "lock"}
                </span>
                <span className="linkName">
                  {checkCreatorStatus() ? "Logged in" : "Login"}
                </span>
              </div>
            </li>
          </ul>
          <Login isFixed={true} />
        </nav>
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/templates" element={<BrowseTemplates />} />
          <Route path="/createlist" element={<Main />} />
          <Route path="/toplists" element={<BrowseToplists />} />
          <Route path="/new-template" element={<NewTemplate />} />
          <Route path="/createlist/:templateId" element={<NewList />} />
          <Route
            path="/edit-template/:templateid"
            element={<EditTemplate admin={true} />}
          />
          <Route path="/toplists/:rankId" element={<Ranking />} />
        </Routes>
      </Router>
    );
  }
}

export default App;
