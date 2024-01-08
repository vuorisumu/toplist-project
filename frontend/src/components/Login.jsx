import { useState } from "react";
import { login } from "./api";
import PropTypes from "prop-types";

function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

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

  return (
    <div>
      <label>User: </label>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <br />
      <label>Password: </label>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={handleLogin}>Login</button>
    </div>
  );
}

Login.propTypes = {
  onLogin: PropTypes.func.isRequired,
};

export default Login;