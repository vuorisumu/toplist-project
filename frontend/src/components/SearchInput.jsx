import { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";

/**
 * Reusable search input component that will automatically suggest items from the given suggestion
 * list when the user starts writing to the input field.
 * @param {string} props.initValue - the initial value of the field
 * @param {string} props.placeholder - the placeholder text for the input field
 * @param {array} props.suggestionData - string array containing all the items used for suggestions
 * @param {function} props.onSelected - callback function for sending the selected value forward
 * @param {function} props.onChange - callback function for when the value has been manually changed
 */
function SearchInput({
  initValue,
  placeholder,
  suggestionData,
  onSelected,
  onChange,
  checkKey,
}) {
  const [suggestions, setSugesstions] = useState([]);
  const [hideSuggestions, setHideSuggestions] = useState(false);
  const [selectedValue, setSelectedValue] = useState(initValue || "");
  const suggRef = useRef(null);

  // Hide suggestion box on unfocus
  useEffect(() => {
    const clickOutside = (event) => {
      if (suggRef.current && !suggRef.current.contains(event.target)) {
        setHideSuggestions(true);
      }
    };

    document.addEventListener("click", clickOutside);

    return () => {
      document.removeEventListener("click", clickOutside);
    };
  }, [suggRef]);

  /**
   * Filters the suggestion based on the user given input
   * @param {KeyboardEvent} e - Keyboard event containing the information of the
   * current input field value
   */
  const filterSuggestions = (e) => {
    const filteredSuggestions = suggestionData.filter((i) =>
      i.toUpperCase().startsWith(e.target.value.toUpperCase())
    );
    setSugesstions(filteredSuggestions.slice(0, 20));
  };

  /**
   * Handles the change in the input field and hides the suggestions
   * @param {ChangeEvent} e - event containing information about the current input value
   */
  const handleChange = (e) => {
    const input = e.target.value;
    setHideSuggestions(false);
    setSelectedValue(input);
    onChange(input);
  };

  /**
   * Sets the selected value from the suggestions to the input
   * @param {string} value - selected suggestion
   */
  const selectSuggestion = (value) => {
    onSelected(value);
    setSelectedValue(value);
    setHideSuggestions(true);
  };

  return (
    <div ref={suggRef} className="suggestionCont">
      <div className="searchWrapper">
        <input
          type="search"
          placeholder={placeholder}
          value={selectedValue}
          onChange={handleChange}
          onKeyUp={filterSuggestions}
          onKeyDown={checkKey}
        />
      </div>

      <div className={`suggestions ${hideSuggestions ? "" : "active"}`}>
        {suggestions.map((item, idx) => (
          <div
            key={"" + item + idx}
            onClick={() => {
              selectSuggestion(item);
            }}
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}

SearchInput.propTypes = {
  initValue: PropTypes.string,
  placeholder: PropTypes.string,
  suggestionData: PropTypes.array.isRequired,
  onSelected: PropTypes.func,
  onChange: PropTypes.func.isRequired,
  checkKey: PropTypes.func,
};

export default SearchInput;
