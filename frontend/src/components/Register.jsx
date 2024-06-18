import { useState } from "react";

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");

  const onSubmit = () => {
    console.log(username, email, password);
  };

  return (
    <div className="container">
      <h1>Create an account</h1>
      <div className="no-stretch">
        <form className="info" onSubmit={onSubmit}>
          <label>Username:</label>
          <input
            type="text"
            id="username"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <label>Email:</label>
          <input
            type="text"
            id="email"
            placeholder="example@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label>Password:</label>
          <input
            type="password"
            id="password"
            placeholder="********"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <label>Repeat password:</label>
          <input
            type="password"
            id="repeat password"
            placeholder="********"
            value={repeatPassword}
            onChange={(e) => setRepeatPassword(e.target.value)}
          />

          <button type="submit" value="Submit">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;
