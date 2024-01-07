import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "./App.css";
import Main from "./components/Main.jsx";
import NewTemplate from "./components/NewTemplate.jsx";
import CreateListing from "./components/CreateListing.jsx";
import Login from "./components/Login.jsx";

class App extends React.Component {
  constructor(props) {
    super(props);

    // get login info
    const storedAuth = localStorage.getItem("auth");
    const storedRole = localStorage.getItem("role");

    this.state = {
      isAuthenticated: storedAuth === "true" || false,
      role: storedRole || "",
    };
  }

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
  };

  handleLogout = () => {
    this.setState(
      {
        isAuthenticated: false,
        role: "",
      },
      () => {
        localStorage.setItem("auth", "false");
        localStorage.setItem("role", "");
      }
    );
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
              <Link to="/new-template">New template</Link>
            </li>
          </ul>
        </nav>
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/createlisting" element={<Main />} />
          <Route path="/new-template" element={<NewTemplate />} />
          <Route
            path="/createlisting/:templateId"
            element={<CreateListing />}
          />
        </Routes>
      </Router>
    );
  }
}

export default App;
