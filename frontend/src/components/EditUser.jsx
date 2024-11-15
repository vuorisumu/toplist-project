import { useContext, useEffect, useState } from "react";
import UserContext from "../util/UserContext";
import { useNavigate } from "react-router-dom";
import { fetchUserByEmail, fetchUserByName } from "../api/users";
import { formatData } from "../util/dataHandler";
import Joi from "joi";

function EditUser() {
  const { user } = useContext(UserContext);
  const [username, setUsername] = useState("");
  const [editName, setEditName] = useState(false);
  const [nameError, setNameError] = useState([]);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState([]);
  const [editEmail, setEditEmail] = useState(false);
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [changePassword, setChangePassword] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const userNameValidator = Joi.string()
    .regex(RegExp("^[\u00C0-\u017Fa-zA-Z0-9-' .()]*$"))
    .min(1)
    .max(50)
    .label("username")
    .messages({
      "string.min": "Username must not be blank",
      "string.max": "Username must not be more than 50 characters",
      "string.pattern.base": "Username contains unallowed special characters",
    });

  const emailValidator = Joi.string()
    .email({ tlds: false })
    .label("email")
    .error((err) => {
      err[0].message = "Email must be a valid email";
      return err;
    });

  const userSchema = Joi.object({
    user_name: Joi.string()
      .regex(RegExp("^[\u00C0-\u017Fa-zA-Z0-9-' .()]*$"))
      .max(50)
      .required()
      .label("username")
      .messages({
        "string.empty": "Username must not be blank",
        "string.max": "Username must not be more than 50 characters",
        "string.pattern.base": "Username contains unallowed special characters",
      }),
    email: Joi.string()
      .email({ tlds: false })
      .required()
      .label("email")
      .error((err) => {
        err[0].message = "Email must be a valid email";
        return err;
      }),
    password: Joi.string()
      .min(6)
      .required()
      .label("password")
      .error((err) => {
        err[0].message = "Password must be more than 6 characters long";
        return err;
      }),
    repeatPassword: Joi.any()
      .valid(Joi.ref("password"))
      .required()
      .label("repeat password")
      .error((err) => {
        err[0].message = "Password fields must match";
        return err;
      }),
  });

  useEffect(() => {
    if (!user) {
      navigate("/");
    } else {
      setUsername(user.user_name);
      setEmail(user.email);
    }
  }, [user]);

  useEffect(() => {
    const delayedUpdate = setTimeout(async () => {
      if (username === user.user_name) {
        setNameError([]);
      }
      if (username.trim() !== "" && username !== user.user_name) {
        const { error } = userNameValidator.validate(username, {
          abortEarly: false,
        });
        if (error) {
          setNameError(error.details);
        } else {
          const canCreate = await nameAvailable();
          if (!canCreate) {
            setNameError([{ message: "Username unavailable" }]);
          } else {
            setNameError([]);
          }
        }
      }
    }, 800);

    return () => clearTimeout(delayedUpdate);
  }, [username]);

  useEffect(() => {
    const delayedUpdate = setTimeout(async () => {
      if (email === user.email) {
        setEmailError([]);
      }
      if (email !== "" && email !== user.email) {
        const { error } = emailValidator.validate(email, {
          abortEarly: false,
        });
        if (error) {
          setEmailError(error.details);
        } else {
          const canCreate = await emailAvailable();
          if (!canCreate) {
            setEmailError([{ message: "Email already in use" }]);
          } else {
            setEmailError([]);
          }
        }
      }
    }, 800);

    return () => clearTimeout(delayedUpdate);
  }, [email]);

  const toggleEditName = () => {
    setUsername(user.user_name);
    setEditName(!editName);
  };

  const toggleEditEmail = () => {
    setEmail(user.email);
    setEditEmail(!editEmail);
  };

  const toggleChangePassword = () => {
    setChangePassword(!changePassword);
  };

  const saveChanges = () => {
    console.log("save");
  };

  const nameAvailable = async () => {
    console.log("fetching name");
    try {
      const data = await fetchUserByName(username);
      const formattedData = formatData(data);
      if (formattedData.length > 0) {
        return false;
      } else {
        return true;
      }
    } catch (err) {
      console.log(err);
      return false;
    }
  };

  const emailAvailable = async () => {
    console.log("fetching email");
    try {
      const data = await fetchUserByEmail(email);
      const formattedData = formatData(data);
      if (formattedData.length > 0) {
        return false;
      } else {
        return true;
      }
    } catch (err) {
      console.log(err);
      return false;
    }
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
                  {nameError.length > 0 && (
                    <ul>
                      {nameError.map((err, index) => (
                        <li key={index}>{err.message}</li>
                      ))}
                    </ul>
                  )}
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
                  {emailError.length > 0 && (
                    <ul>
                      {emailError.map((err, index) => (
                        <li key={index}>{err.message}</li>
                      ))}
                    </ul>
                  )}
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
