import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "./App.css";
import Main from "./components/Main.jsx";
import NewTemplate from "./components/NewTemplate.jsx";
import CreateListing from "./components/CreateListing.jsx";
import Login from "./components/Login.jsx";
import EditTemplate from "./components/EditTemplate.jsx";
import BrowseRankings from "./components/BrowseRankings.jsx";
import Ranking from "./components/Ranking.jsx";
import BrowseTemplates from "./components/BrowseTemplates.jsx";
import { checkCreatorStatus } from "./components/util.js";

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
    if (e.key === "Backspace" && document.activeElement.tagName !== "INPUT") {
      window.history.back();
    }
  }

  render() {
    return (
      <Router>
        <nav>
          <ul>
            <li>
              <Link to="/">Main</Link>
            </li>
            <li>
              <Link to="/templates">Templates</Link>
            </li>
            <li>
              <Link to="/rankings">Top lists</Link>
            </li>
            {checkCreatorStatus() && (
              <li>
                <Link to="/new-template">New template</Link>
              </li>
            )}
          </ul>
          <Login isFixed={true} />
        </nav>
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/templates" element={<BrowseTemplates />} />
          <Route path="/createranking" element={<Main />} />
          <Route path="/rankings" element={<BrowseRankings />} />
          <Route path="/new-template" element={<NewTemplate />} />
          <Route
            path="/createranking/:templateId"
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
