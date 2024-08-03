import { useContext, useEffect, useState } from "react";
import UserContext from "../util/UserContext";

function HiddenMenu() {
  const { user, login, logout } = useContext(UserContext);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
  }, [isOpen]);

  return (
    <div className="hiddenMenuCont" id="hiddenMenu">
      <div className="hiddenMenu">
        <p>Test</p>
      </div>
    </div>
  );
}

export default HiddenMenu;
