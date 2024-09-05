import { useEffect, useRef } from "react";
import Search from "./Search";
import { fetchAllNamesByInput } from "../util/dataHandler";

function SearchBar({ isOpen, toggleSearch }) {
  const searchInput = useRef("");
  const setSearch = (val) => (searchInput.current = val);
  const searchRef = useRef(null);

  useEffect(() => {
    const clickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        toggleSearch();
      }
    };

    document.addEventListener("click", clickOutside);

    return () => {
      document.removeEventListener("click", clickOutside);
    };
  }, [searchRef, toggleSearch]);

  /**
   * Pressing the enter key on default search field.
   *
   * @param {string} val - the current value of the input field
   */
  const onEnter = (val) => {
    toggleSearch();
    setSearch(val);
    console.log(val);
  };

  return (
    <div className="searchContainer" ref={searchRef}>
      <div className="searchInput general">
        <Search
          valueUpdated={setSearch}
          fetchFunction={fetchAllNamesByInput}
          combinedSearch={true}
          onClear={() => setSearch("")}
          onEnterKey={onEnter}
        />
      </div>
    </div>
  );
}

export default SearchBar;
