import { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";

function TagInput({
  initValue,
  placeholder,
  suggestionData,
  onSelected,
  onChange,
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

  // filter suggestion based on given value
  const filterSuggestions = (e) => {
    setSugesstions(
      suggestionData.filter((i) =>
        i.toUpperCase().startsWith(e.target.value.toUpperCase())
      )
    );
  };

  // handle value change based on user input
  const handleChange = (e) => {
    const input = e.target.value;
    setHideSuggestions(false);
    setSelectedValue(input);
    onChange(input);
  };

  // handle selecting value from suggestions
  const selectSuggestion = (value) => {
    onSelected(value);
    setSelectedValue(value);
    setHideSuggestions(true);
  };

  return (
    <div ref={suggRef}>
      <div>
        <input
          type="search"
          placeholder={placeholder}
          value={selectedValue}
          onChange={handleChange}
          onKeyUp={filterSuggestions}
        />
      </div>

      <div style={{ display: hideSuggestions ? "none" : "block" }}>
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

TagInput.propTypes = {
  initValue: PropTypes.string,
  placeholder: PropTypes.string,
  suggestionData: PropTypes.array.isRequired,
  onSelected: PropTypes.func,
  onChange: PropTypes.func.isRequired,
};

export default TagInput;
