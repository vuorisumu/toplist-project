import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "./App.css";
import Main from "./components/Main.jsx";
import NewTemplate from "./components/NewTemplate.jsx";
import CreateListing from "./components/CreateListing.jsx";

class App extends React.Component {
  render() {
    return (
      <Router>
        <nav>
          <ul>
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
