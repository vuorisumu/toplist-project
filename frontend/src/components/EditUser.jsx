import { useContext, useEffect, useState } from "react";
import UserContext from "../util/UserContext";
import { useNavigate } from "react-router-dom";
import {
  deleteUser,
  fetchUserByEmail,
  fetchUserByName,
  updateuser,
  userLogin,
} from "../api/users";
import { formatData } from "../util/dataHandler";
import Joi from "joi";
import ButtonPrompt from "./ButtonPrompt";
import { deleteTemplatesFromUser } from "../api/templates";
import { deleteToplistFromUser } from "../api/toplists";

function EditUser() {
  const { user, updateUser, logout } = useContext(UserContext);
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
  const [saved, setSaved] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteTemplates, setDeleteTemplates] = useState(false);
  const [deleteLists, setDeleteLists] = useState(false);
  const [delPassword, setDelPassword] = useState("");

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

  const passwordSchema = Joi.object({
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

  useEffect(() => {
    const delayedUpdate = setTimeout(async () => {
      if (delPassword !== "") {
        const userData = {
          user: user.user_name,
          password: delPassword,
        };
        const res = await userLogin(userData);
        if (!res.error) {
          setIsDeleting(true);
        } else {
          setIsDeleting(false);
        }
      } else {
        setIsDeleting(false);
      }
    }, 1000);

    return () => clearTimeout(delayedUpdate);
  }, [delPassword]);

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

  const saveChanges = async () => {
    if (changePassword) {
      const newPass = {
        password: password,
        repeatPassword: repeatPassword,
      };
      const { error } = passwordSchema.validate(newPass, { abortEarly: false });
      if (error) {
        setErrors(error.details);
        return;
      }
    } else {
      setErrors([]);
    }

    if (oldPassword === "") {
      setErrors([{ message: "No password given" }]);
      return;
    }

    const newData = {};
    if (username !== user.user_name) {
      newData.user_name = username;
    }

    if (email !== user.email) {
      newData.email = email;
    }

    if (changePassword) {
      newData.password = password;
    }

    if (!newData.user_name && !newData.email && !newData.password) {
      console.log("nothing to change");
      return;
    }

    const userData = {
      user: user.user_name,
      password: oldPassword,
    };
    const res = await userLogin(userData);
    if (!res.error) {
      setLoading(true);
      const updateRes = await updateuser(user.id, newData);
      setLoading(false);
      if (!updateRes.error) {
        updateUser(newData);
        setSaved(true);
        setPassword("");
        setRepeatPassword("");
        setOldPassword("");
      }
    } else {
      setErrors([{ message: res.error }]);
    }
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

  const handleDelete = async () => {
    if (deleteTemplates) {
      console.log("Deleting templates");
      const tres = await deleteTemplatesFromUser(user.id);
      console.log(tres);
    }

    if (deleteLists) {
      console.log("Deleting lists");
      const lres = await deleteToplistFromUser(user.id);
      console.log(lres);
    }

    const res = await deleteUser(user.id);
    console.log(res);
    logout();
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
          {errors.length > 0 && (
            <ul>
              {errors.map((err, index) => (
                <li key={index}>{err.message}</li>
              ))}
            </ul>
          )}

          {saved && <p>Account information updated!</p>}
          <button onClick={saveChanges} disabled={loading}>
            Save changes
          </button>

          <div>
            <p>Delete user</p>
            <p>Type your password</p>
            <input
              type="password"
              value={delPassword}
              onChange={(e) => setDelPassword(e.target.value)}
            />

            {isDeleting && (
              <>
                <div>
                  <label>Delete all templates: </label>
                  <div className="toggle">
                    <input
                      type="checkbox"
                      name="toggleTemp"
                      id="toggleTemp"
                      checked={deleteTemplates}
                      onChange={() => setDeleteTemplates(!deleteTemplates)}
                    />
                    <label htmlFor="toggleTemp"></label>
                  </div>
                </div>

                <div>
                  <label>Delete all lists: </label>
                  <div className="toggle">
                    <input
                      type="checkbox"
                      name="toggleList"
                      id="toggleList"
                      checked={deleteLists}
                      onChange={() => setDeleteLists(!deleteLists)}
                    />
                    <label htmlFor="toggleList"></label>
                  </div>
                </div>

                <ButtonPrompt
                  buttonName="Delete account"
                  confirm={handleDelete}
                />
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default EditUser;
