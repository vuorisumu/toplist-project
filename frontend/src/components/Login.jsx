import { useEffect, useState } from "react";
import { login } from "./api";
import { checkCreatorStatus } from "./util";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [role, setRole] = useState("");

  useEffect(() => {
    if (checkCreatorStatus()) {
      setLoggedIn(true);
      setRole(localStorage.getItem("role"));
    } else {
      setLoggedIn(false);
    }
  }, []);

  const handleLogin = async () => {
    if (username === "" || password === "") return;

    try {
      const loginData = {
        role: username,
        password: password,
      };

      const res = await login(loginData);
      if (!res.error) {
        // successfully log in
        onLogin(username);
      } else {
        // clear password
        setPassword("");
      }
    } catch (err) {
      console.error("Error during login: " + err);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  // handle user login
  const onLogin = async (role) => {
    localStorage.setItem("admin", role === "admin" ? "true" : "false");
    localStorage.setItem("login", "true");
    localStorage.setItem("role", role);
    window.location.reload(false);
  };

  // handle user logout
  const onLogout = () => {
    // store logout
    localStorage.setItem("admin", "false");
    localStorage.setItem("login", "false");
    localStorage.setItem("role", "");
    window.location.reload(false);
  };

  return (
    <>
      {!loggedIn ? (
        <div>
          <label>User: </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <br />
          <label>Password: </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={handleKeyDown}
          />

          <button onClick={handleLogin}>Login</button>
        </div>
      ) : (
        <div>
          <p>{`Logged in as ${role}`}</p>
          <button type="button" onClick={onLogout}>
            Logout
          </button>
        </div>
      )}
    </>
  );
}

export default Login;
