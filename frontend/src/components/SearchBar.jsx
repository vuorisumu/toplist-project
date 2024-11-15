import { useEffect, useRef } from "react";
import Search from "./Search";
import { fetchAllNamesByInput } from "../util/dataHandler";
import { useNavigate } from "react-router-dom";

function SearchBar({ isOpen, toggleSearch }) {
  const searchInput = useRef("");
  const setSearch = (val) => (searchInput.current = val);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const clickOutside = (event) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target) &&
        document.getElementById("searchBar").classList.contains("active") &&
        !event.target.classList.contains("searchElement")
      ) {
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
    if (isOpen) {
      setSearch(val);
      navigate(`/search/${val}`);
    } else {
      toggleSearch();
    }
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
          placeholder={searchInput.current}
        />
      </div>
    </div>
  );
}

export default SearchBar;
