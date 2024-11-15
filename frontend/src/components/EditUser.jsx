import { useContext, useEffect, useState } from "react";
import UserContext from "../util/UserContext";
import { useNavigate } from "react-router-dom";

function EditUser() {
  const { user } = useContext(UserContext);
  const [username, setUsername] = useState("");
  const [editName, setEditName] = useState(false);
  const [email, setEmail] = useState("");
  const [editEmail, setEditEmail] = useState(false);
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [changePassword, setChangePassword] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/");
    } else {
      setUsername(user.user_name);
      setEmail(user.email);
    }
  }, [user]);

  const toggleEditName = () => {
    setEditName(!editName);
  };

  const toggleEditEmail = () => {
    setEditEmail(!editEmail);
  };

  const toggleChangePassword = () => {
    setChangePassword(!changePassword);
  };

  const saveChanges = () => {
    console.log("save");
  };

  return (
    <div className="container">
      <h1>Account information</h1>
      {user && (
        <>
          <ul>
            <li>
              <p>Username</p>
              {editName ? (
                <>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                  <button onClick={toggleEditName}>
                    <span className="material-symbols-outlined icon">
                      cancel
                    </span>
                  </button>
                </>
              ) : (
                <>
                  <p>{username}</p>
                  <button onClick={toggleEditName}>
                    <span className="material-symbols-outlined icon">edit</span>
                  </button>
                </>
              )}
            </li>
            <li>
              {editEmail ? (
                <>
                  <input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <button onClick={toggleEditEmail}>
                    <span className="material-symbols-outlined icon">
                      cancel
                    </span>
                  </button>
                </>
              ) : (
                <>
                  <p>{email}</p>
                  <button onClick={toggleEditEmail}>
                    <span className="material-symbols-outlined icon">edit</span>
                  </button>
                </>
              )}
            </li>
            <li>
              {changePassword ? (
                <>
                  <label>New password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />

                  <label>Repeat new password</label>
                  <input
                    type="password"
                    value={repeatPassword}
                    onChange={(e) => setRepeatPassword(e.target.value)}
                  />

                  <button onClick={toggleChangePassword}>Cancel</button>
                </>
              ) : (
                <button onClick={toggleChangePassword}>Change password</button>
              )}
            </li>
            <li>
              {changePassword ? <p>Old password</p> : <p>Password</p>}
              <input
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
              />
            </li>
          </ul>
          <button onClick={saveChanges}>Save changes</button>
        </>
      )}
    </div>
  );
}

export default EditUser;
