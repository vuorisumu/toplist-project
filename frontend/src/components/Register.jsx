import { useState } from "react";
import { addNewUser, fetchUserByNameOrEmail } from "./api";
import { formatData } from "../util/dataHandler";
import Joi from "joi";

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [errors, setErrors] = useState([]);

  const userSchema = Joi.object({
    user_name: Joi.string()
      .required()
      .label("username")
      .error((err) => {
        err[0].message = "Username must not be blank";
        return err;
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

  const onSubmit = async (event) => {
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

      const canCreateRes = await canCreate();
      if (canCreateRes) {
        console.log("Can create");
        const newUserData = {
          user_name: username,
          email: email,
          password: password,
        };
        const newUserRes = await addNewUser(newUserData);
        console.log(newUserRes);
      } else {
        setErrors([{ message: "User already exists" }]);
      }
    }
    event.preventDefault();
  };

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

          <button type="submit" value="Submit">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;
