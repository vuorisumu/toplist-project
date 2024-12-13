import { useEffect, useState } from "react";
import { fetchUserNamesByInput } from "../api/users";
import { formatData } from "../util/dataHandler";
import { Link } from "react-router-dom";

function UserSearch({ searchInput = "" }) {
  const [users, setUsers] = useState([]);
  useEffect(() => {
    if (searchInput !== "") {
      fetchUserNamesByInput(searchInput).then((d) => {
        const formattedData = formatData(d);
        setUsers(formattedData);
      });
    }
  }, [searchInput]);

  if (users.length > 0) {
    return (
      <div>
        <h2>Users</h2>
        <ul>
          {users.map((u, i) => (
            <li key={`user${i}`}>
              <Link to={`/user/${u.user_name}`}>{u.user_name}</Link>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

export default UserSearch;
