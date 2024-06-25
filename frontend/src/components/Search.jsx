import { useState, useEffect } from "react";

function Search({ valueUpdated }) {
  const placeholder = "placeholder";
  const [value, setValue] = useState("");

  useEffect(() => {
    const delayedUpdate = setTimeout(() => {
      valueUpdated(value);
    }, 600);

    return () => clearTimeout(delayedUpdate);
  }, [value]);

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
    <>
      <input
        type="search"
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        onKeyUp={keyUp}
        onKeyDown={checkKey}
      />
    </>
  );
}

export default Search;
