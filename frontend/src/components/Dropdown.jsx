// import { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { useState, useEffect, useRef } from "react";

function Dropdown({ label, placeholder, items, onSelect }) {
  const [selectedItem, setSelectedItem] = useState(null);
  const [hideOptions, setHideOptions] = useState(true);
  const ref = useRef(null);

  // Hide options box on unfocus
  useEffect(() => {
    const clickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setHideOptions(true);
      }
    };

    document.addEventListener("click", clickOutside);

    return () => {
      document.removeEventListener("click", clickOutside);
    };
  }, [ref]);

  const handleOpen = () => {
    setHideOptions(!hideOptions);
  };

  const handleItemClick = (item) => {
    setSelectedItem(item);
    setHideOptions(true);
    onSelect(item);
  };

  return (
    <div>
      <button type="button" onClick={handleOpen}>
        {label || "Selected"}: {selectedItem || placeholder}
      </button>
      <div style={{ display: hideOptions ? "none" : "block" }}>
        <ul>
          {items.map((i, index) => (
            <li key={index} onClick={() => handleItemClick(i)}>
              {i}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

Dropdown.propTypes = {
  label: PropTypes.string,
  placeholder: PropTypes.string,
  items: PropTypes.array,
  onSelect: PropTypes.func,
};

export default Dropdown;
