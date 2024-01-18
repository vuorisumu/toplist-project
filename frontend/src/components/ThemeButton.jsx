import { useEffect, useState } from "react";

/**
 * Theme change button that can be used anywhere
 * @returns the button that changes the theme
 */
function ThemeButton() {
  const [darkTheme, setDarkTheme] = useState(false);

  useEffect(() => {
    const prevTheme = localStorage.getItem("theme");

    if (prevTheme) {
      setTheme(prevTheme);
    } else {
      const lightPref = window.matchMedia("(prefers-color-scheme: light)");
      setTheme(lightPref.matches ? "dark" : "light");
    }
  }, []);

  /**
   * Changes the theme and stores it in the localStorage
   * @param {string} themeName - name of the theme
   */
  const setTheme = (themeName) => {
    document.documentElement.setAttribute("data-theme", themeName);
    localStorage.setItem("theme", themeName);
    setDarkTheme(themeName === "dark");
  };

  /**
   * Handles the button click and calls for a theme change
   * based on the current theme
   */
  const handleThemeToggle = () => {
    setTheme(darkTheme ? "light" : "dark");
  };

  return (
    <div
      type="button"
      id="themeButton"
      onClick={handleThemeToggle}
      style={{ cursor: "pointer" }}
    >
      <span className="material-symbols-outlined icon">contrast</span>
      <span className="linkName">Change theme</span>
    </div>
  );
}

export default ThemeButton;
