import { useContext, useState } from "react";
import { formatData } from "../util/dataHandler";
import Joi from "joi";
import { useNavigate } from "react-router-dom";
import { fetchUserByNameOrEmail, addNewUser } from "../api/users";
import UserContext from "../util/UserContext";

/**
 * View for new user registration. Renders a form for account creation.
 *
 * @returns {JSX.Element} Registration component
 */
function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [errors, setErrors] = useState([]);
  const navigate = useNavigate();
  const { login } = useContext(UserContext);
  const [loading, setLoading] = useState(false);

  /**
   * Validation schema for new account creation.
   * All fields are required, email must be a valid email and password
   * must be more than 6 characters long. Password must also be repeated.
   */
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

  /**
   * Passes given information to validation schema and sets error messages
   * if needed. If no errors were found, adds the user to database.
   * @param {Event} event - The form submission event object.
   */
  const onSubmit = async (event) => {
    event.preventDefault();
    if (loading) return;

    const userData = {
      user_name: username,
      email: email,
      password: password,
      repeatPassword: repeatPassword,
    };
    const { error } = userSchema.validate(userData, { abortEarly: false });
    if (error) {
      setErrors(error.details);
    } else {
      setErrors([]);
      setLoading(true);

      const canCreateRes = await canCreate();
      if (canCreateRes) {
        const newUserData = {
          user_name: username,
          email: email,
          password: password,
        };
        const newUserRes = await addNewUser(newUserData);
        if (newUserRes.user_name) {
          try {
            const loginData = {
              user: username,
              password: password,
            };
            await login(loginData);
          } catch (err) {
            console.error("Error during login: " + err);
          }
          setLoading(false);
          navigate(`/user/${newUserRes.user_name}`);
        } else {
          setErrors([{ message: "Unexpected error" }]);
        }
      } else {
        setErrors([{ message: "User already exists" }]);
      }
    }
  };

  /**
   * Searches the database for possible duplicates so every email and username
   * are unique.
   * @returns false if a user was found by given username or email, true if not.
   */
  const canCreate = async () => {
    console.log("fetching");
    try {
      const data = await fetchUserByNameOrEmail(username, email);
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
      <h1>Create an account</h1>
      <div className="no-stretch">
        <form onSubmit={onSubmit}>
          <div className="info">
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
          </div>

          {errors.length > 0 && (
            <ul>
              {errors.map((err, index) => (
                <li key={index}>{err.message}</li>
              ))}
            </ul>
          )}

          {loading && <p>Creating account...</p>}

          <button
            type="submit"
            value="Submit"
            disabled={loading}
            className={loading ? "disabled" : ""}
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;
