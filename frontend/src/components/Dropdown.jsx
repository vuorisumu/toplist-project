// import { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { useState, useEffect, useRef } from "react";

/**
 * Reusable dropdown component that displays selectable items by clicking the dropdown button and closes the
 * dropdown menu by selecting an item from the menu, or clicking outside the dropdown container.
 * @param {string} props.label - text labeling the dropdown menu, defaults to "Selected" if not specified
 * @param {string} props.placeholder - placeholder text for the default option when no item is selected
 * @param {array} props.items - string array containing the items that can be selected from the dropdown menu
 * @param {function} props.onSelect - callback function to be called when an item is selected
 * @returns JXS element that displays the dropdown button and selecatble options
 */
function Dropdown({ label, placeholder, items, onSelect }) {
  const [selectedItem, setSelectedItem] = useState(null);
  const [hideOptions, setHideOptions] = useState(true);
  const ref = useRef(null);

  // Hide options box on unfocus
  useEffect(() => {
    /**
     * Hides the dropdown menu when the user clicks outside of the dropdown container
     * @param {MouseEvent} event - Mouse event containing the target that was clicked
     */
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

  /**
   * Sets the option container visible
   */
  const handleOpen = () => {
    setHideOptions(!hideOptions);
  };

  /**
   * Handles selecting an item from the dropdown menu. Stores the selected item,
   * closes the dropdown menu and sends the selected item to callback function
   * @param {string} item - selected item from the dropdown menu
   */
  const handleItemClick = (item) => {
    setSelectedItem(item);
    setHideOptions(true);
    onSelect(item);
  };

  return (
    <div className="dropdownCont">
      <button type="button" onClick={handleOpen} className="dropdownButton">
        {label || "Selected"}: {selectedItem || placeholder}
      </button>
      <div
        style={{ display: hideOptions ? "none" : "block" }}
        className="dropdownItems"
      >
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
