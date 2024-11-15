import { useContext } from "react";
import UserContext from "../util/UserContext";
import { useNavigate } from "react-router-dom";

function EditUser() {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  if (!user) {
    navigate("/");
  }

  return (
    <div className="container">
      <h1>Account information</h1>
      <p>{user.user_name}</p>
    </div>
  );
}

export default EditUser;
