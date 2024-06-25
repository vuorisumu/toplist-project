import { useState, useEffect, useRef } from "react";

function Search({ valueUpdated, suggestions }) {
  const placeholder = "placeholder";
  const [value, setValue] = useState("");
  const [hideSuggestions, setHideSuggestions] = useState(false);
  const suggRef = useRef(null);

  // Only send the value to callback after the user has stopped typing
  useEffect(() => {
    const delayedUpdate = setTimeout(() => {
      valueUpdated(value);
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

  const handleChange = (e) => {
    setValue(e.target.value);
  };

  const keyUp = () => {
    console.log("key up");
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

      <div className={`suggestions ${hideSuggestions ? "" : "active"}`}></div>
    </div>
  );
}

export default Search;
