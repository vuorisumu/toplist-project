import { useState, useEffect, useRef } from "react";
import { fetchTemplateNamesByInput } from "./api";
import { getTemplateNamesFromData } from "../util/dataHandler";

function Search({
  valueUpdated,
  fetchFunction,
  combinedSearch = false,
  onClear,
}) {
  const placeholder = "placeholder";
  const [value, setValue] = useState("");
  const [hideSuggestions, setHideSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const suggRef = useRef(null);

  useEffect(() => {
    if (onClear) {
      setValue("");
    }
  }, [onClear]);

  // Only send the value to callback after the user has stopped typing
  useEffect(() => {
    const delayedUpdate = setTimeout(() => {
      valueUpdated(value);
      setHideSuggestions(false);
      updateSuggestions();
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
      fetchFunction(value)
        .then((data) => {
          const names = combinedSearch ? data : getTemplateNamesFromData(data);
          setSuggestions(names);
        })
        .catch((err) => console.log(err));
    }
  };

  const handleChange = (e) => {
    setHideSuggestions(false);
    setValue(e.target.value);
  };

  const keyUp = () => {
    // console.log("key up");
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
          onKeyUp={keyUp}
          onKeyDown={checkKey}
        />
      </div>

      <div className={`suggestions ${hideSuggestions ? "" : "active"}`}>
        {suggestions.length > 0 &&
          suggestions.map((item, index) => (
            <div
              key={"" + item + index}
              onClick={() => {
                console.log(item);
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
