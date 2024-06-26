import { useState, useEffect, useRef } from "react";
import { fetchTemplateNamesByInput } from "./api";
import { getTemplateNamesFromData } from "../util/dataHandler";

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

  const handleChange = (e) => {
    userInputRef.current = true;
    setValue(e.target.value);
  };

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
