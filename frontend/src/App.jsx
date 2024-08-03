import React, { useEffect, useState } from "react";
import {
  HashRouter as Router,
  Routes,
  Route,
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
import { isMobile } from "react-device-detect";
import { auth, userLogin } from "./api/users.js";
import UserContext from "./util/UserContext.js";
import { isLoggedIn, loginInfo } from "./util/permissions.js";
import TemplatePreview from "./components/TemplatePreview.jsx";
import MyTemplates from "./components/MyTemplates.jsx";

function App() {
  function RedirectToCreateList() {
    const { templateId } = useParams();
    return <Navigate to={`/createlist/${templateId}`} />;
  }

  const [user, setUser] = useState(null);

  useEffect(() => {
    if (isLoggedIn()) {
      setUser(loginInfo());
    }
  }, []);

  const login = async (userData) => {
    try {
      const res = await userLogin(userData);
      console.log(res);
      if (!res.error) {
        // successfully log in
        localStorage.setItem("token", res.token);
        const credentials = await auth();
        const loginData = {
          ...credentials,
          user_name: res.user_name,
          email: res.email,
        };
        setUser(loginData);
      } else {
        setUser(null);
      }
    } catch (err) {
      console.error("Error during login: " + err);
      setUser(null);
    }
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      <Router>
        <Nav />
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/templates" element={<BrowseTemplates />} />
          <Route path="/templates/:templateId" element={<TemplatePreview />} />
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
          <Route path="/mytemplates" element={<MyTemplates />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
        <footer className={`${isMobile ? "mobile" : ""}`}>
          <p>Sumu Vuori 2024</p>
        </footer>
      </Router>
    </UserContext.Provider>
  );
}

export default App;
