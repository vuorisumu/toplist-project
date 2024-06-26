/**
 * Formats a given date to a prettier format
 * @param {Date} date - date to be formatted
 * @returns a formatted date as a string
 */
export const formatDate = (date) => {
  const options = {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  };

  const formattedDate = new Date(date).toLocaleString(undefined, options);

  return formattedDate;
};

/**
 * Refreshes the view, clearing all input fields
 */
export const clearAll = () => {
  window.location.reload(false);
};
