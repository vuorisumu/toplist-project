import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { fetchUserByName } from "./api";
import { formatData } from "../util/dataHandler";

function User() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const userName = decodeURI(location.pathname.replace("/user/", ""));

  useEffect(() => {
    if (userName !== "") {
      fetchUserByName(userName)
        .then((data) => {
          const formattedData = formatData(data);
          setUserData(formattedData[0]);
          setLoading(false);
        })
        .catch((err) => console.log(err));
    }
  }, []);

  if (loading) {
    return (
      <div className="container">
        <p>Loading</p>
      </div>
    );
  }

  if (userData.length <= 0) {
    return (
      <div className="container">
        <p>User not found</p>
      </div>
    );
  }

  return (
    <div className="container">
      <h2>{userData.user_name}</h2>
      <p>User page here</p>

      <div>
        <h3>Templates</h3>
        <p>Templates created by this user</p>
      </div>

      <div>
        <h3>Top lists</h3>
        <p>Top lists created by this user</p>
      </div>
    </div>
  );
}

export default User;
