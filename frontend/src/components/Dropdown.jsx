// import { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { useState } from "react";

function Dropdown({ isOpen, openTrigger, items, onSelect }) {
  const [selectedItem, setSelectedItem] = useState(null);
  const handleItemClick = (item) => {
    setSelectedItem(item);
    onSelect(item); // Pass the selected item to the parent component
  };

  return (
    <div>
      {openTrigger}
      {isOpen ? (
        <ul>
          {items.map((i, index) => (
            <li key={index} onClick={() => handleItemClick(i)}>
              {i}
            </li>
          ))}
        </ul>
      ) : null}
      <p>Selected: {selectedItem}</p>
    </div>
  );
}

Dropdown.propTypes = {
  isOpen: PropTypes.bool,
  openTrigger: PropTypes.element,
  items: PropTypes.array,
  onSelect: PropTypes.func,
};

export default Dropdown;
