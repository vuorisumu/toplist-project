import React from "react";
import {
  HashRouter as Router,
  Routes,
  Route,
  NavLink,
  Navigate,
  useParams,
} from "react-router-dom";
import "./App.css";
import Main from "./components/Main.jsx";
import NewTemplate from "./components/NewTemplate.jsx";
import EditTemplate from "./components/EditTemplate.jsx";
import BrowseToplists from "./components/BrowseToplists.jsx";
import BrowseTemplates from "./components/BrowseTemplates.jsx";
import NewList from "./components/NewList.jsx";
import SingleList from "./components/SingleList.jsx";
import Register from "./components/Register.jsx";
import User from "./components/User.jsx";
import Nav from "./components/Nav.jsx";

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
    function RedirectToCreateList() {
      const { templateId } = useParams();
      return <Navigate to={`/createlist/${templateId}`} />;
    }

    return (
      <Router>
        <Nav />
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/templates" element={<BrowseTemplates />} />
          <Route
            path="/templates/:templateId"
            element={<RedirectToCreateList />}
          />
          <Route path="/createlist" element={<Main />} />
          <Route path="/toplists" element={<BrowseToplists />} />
          <Route path="/new-template" element={<NewTemplate />} />
          <Route
            path="/createlist/:templateId"
            element={<NewList key={Math.random()} />}
          />
          <Route path="/edit-template/:templateid" element={<EditTemplate />} />
          <Route path="/toplists/:listId" element={<SingleList />} />
          <Route path="/register" element={<Register />} />
          <Route path="/user/:username" element={<User />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    );
  }
}

export default App;
