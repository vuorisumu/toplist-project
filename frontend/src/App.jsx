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
  }

  render() {
    return (
      <Router>
        <nav>
          <ul>
            <li>
              <Login />
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
            element={<EditTemplate admin={true} />}
          />
          <Route path="/rankings/:rankId" element={<Ranking />} />
        </Routes>
      </Router>
    );
  }
}

export default App;
