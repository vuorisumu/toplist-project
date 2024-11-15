function SortByOptions() {
  const options = {
    LIST_NAME: "Template name",
    OLDEST_FIRST: "Oldest first",
    NEWEST_FIRST: "Newest first",
    CREATOR_NAME: "Creator name",
  };
  const selectFromDropdown = (val) => setSortBy(val);
}

export default SortByOptions;
