import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "./App.css";
import Main from "./components/Main.jsx";
import NewTemplate from "./components/NewTemplate.jsx";
import CreateListing from "./components/CreateListing.jsx";
import Login from "./components/Login.jsx";
import EditTemplate from "./components/EditTemplate.jsx";
import BrowSeRankings from "./components/BrowseRankings.jsx";
import Ranking from "./components/Ranking.jsx";

class App extends React.Component {
  constructor(props) {
    super(props);

    // get login info
    const storedAuth = localStorage.getItem("auth");
    const storedRole = localStorage.getItem("role");

    // set state info
    this.state = {
      isAuthenticated: storedAuth === "true" || false,
      role: storedRole || "",
    };
  }

  // handle user login
  handleLogin = async (role) => {
    this.setState(
      {
        isAuthenticated: true,
        role,
      },
      () => {
        // store login
        localStorage.setItem("auth", "true");
        localStorage.setItem("role", role);
      }
    );

    window.location.reload(false);
  };

  // handle user logout
  handleLogout = () => {
    this.setState(
      {
        isAuthenticated: false,
        role: "",
      },
      () => {
        // store logout
        localStorage.setItem("auth", "false");
        localStorage.setItem("role", "");
      }
    );

    window.location.reload(false);
  };

  render() {
    const { isAuthenticated } = this.state;

    return (
      <Router>
        <nav>
          <ul>
            <li>
              {!isAuthenticated && <Login onLogin={this.handleLogin} />}
              {isAuthenticated && (
                <>
                  <p>User is authenticated</p>
                  <button type="button" onClick={this.handleLogout}>
                    Logout
                  </button>
                </>
              )}
            </li>
            <li>
              <Link to="/">Main</Link>
            </li>
            <li>
              <Link to="/rankings">Browse rankings</Link>
            </li>
            <li>
              <Link to="/new-template">New template</Link>
            </li>
          </ul>
        </nav>
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/createlisting" element={<Main />} />
          <Route path="/rankings" element={<BrowSeRankings />} />
          <Route path="/new-template" element={<NewTemplate />} />
          <Route
            path="/createlisting/:templateId"
            element={<CreateListing />}
          />
          <Route
            path="/edit-template/:templateid"
            element={<EditTemplate auth={this.state.isAuthenticated} />}
          />
          <Route path="/rankings/:rankId" element={<Ranking />} />
        </Routes>
      </Router>
    );
  }
}

export default App;
