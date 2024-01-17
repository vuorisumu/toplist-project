import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import PropTypes from "prop-types";

const NavLink = ({ to, icon, text }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    setIsActive(location.pathname === to);
  }, [location.pathname, to]);

  return (
    <li className={isActive ? "current" : ""}>
      <Link to={to} onClick={() => navigate(to)}>
        <span className={`material-symbols-outlined icon`}>{icon}</span>
        <span className="linkName">{text}</span>
      </Link>
    </li>
  );
};

NavLink.propTypes = {
  to: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
};

export default NavLink;
