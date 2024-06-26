import { useState, useEffect, useRef } from "react";
import { getTemplateNamesFromData } from "../util/dataHandler";

/**
 * Reusable custom search bar that displays suggestions based on user
 * input. Fetches the suggestions after a small delay to avoid unnecessary
 * queries.
 *
 * @param {function(string)} props.valueUpdated -  Callback function that
 * is called after a small delay when the search value is updated.
 * @param {function(string)} props.fetchFunction - Function that is used for
 * fetching data with the given input
 * @param {boolean} props.combinedSearch - Whether to search from multiple sources
 * at once or not. Defaults to false.
 * @param {boolean} props.onClear - Flag to clear the search input
 * @param {number} props.templateId - Optional template ID to be used in search
 * queries
 * @returns {JSX.Element} The Search component.
 */
function Search({
  valueUpdated,
  fetchFunction,
  combinedSearch = false,
  onClear,
  templateId,
}) {
  const placeholder = "placeholder";
  const [value, setValue] = useState("");
  const [hideSuggestions, setHideSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const suggRef = useRef(null);
  const userInputRef = useRef(true);

  useEffect(() => {
    if (onClear) {
      setValue("");
    }
  }, [onClear]);

  // Only send the value to callback after the user has stopped typing
  useEffect(() => {
    const delayedUpdate = setTimeout(() => {
      if (userInputRef.current) {
        valueUpdated(value);
        updateSuggestions();

        // Don't show suggestions if the input is blank
        if (value.trim() === "") {
          setHideSuggestions(true);
        } else {
          setHideSuggestions(false);
        }
      }
    }, 600);

    return () => clearTimeout(delayedUpdate);
  }, [value]);

  // Unfocus when clicking outside of the field
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
   * Uses the given fetchFunction with the input value and sets the
   * retrieved data to state.
   */
  const updateSuggestions = async () => {
    if (value.trim() !== "") {
      const inputValue =
        templateId > 0 ? value + `&tempId=${templateId}` : value;
      fetchFunction(inputValue)
        .then((data) => {
          const names = combinedSearch ? data : getTemplateNamesFromData(data);
          setSuggestions(names);
        })
        .catch((err) => console.log(err));
    }
  };

  /**
   * Handles user input
   *
   * @param {ChangeEvent} e - event containing information about the current input value
   */
  const handleChange = (e) => {
    userInputRef.current = true;
    setValue(e.target.value);
  };

  /**
   * Checks which key was pressed.
   *
   * @param {ChangeEvent} e - event containing information about the current input value
   */
  const checkKey = (e) => {
    if (e.key === "Enter") {
      console.log("enter was pressed");
    }
  };

  return (
    <div ref={suggRef} className="suggestionCont">
      <div className="searchWrapper">
        <input
          type="search"
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          onKeyDown={checkKey}
        />
      </div>

      <div className={`suggestions ${hideSuggestions ? "" : "active"}`}>
        {suggestions.length > 0 &&
          suggestions.map((item, index) => (
            <div
              key={"" + item + index}
              onClick={() => {
                userInputRef.current = false;
                setValue(item);
                setHideSuggestions(true);
              }}
            >
              {item}
            </div>
          ))}
      </div>
    </div>
  );
}

export default Search;
