import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

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
      setTheme(lightPref.matches ? "light" : "dark");
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
    <div>
      <label>Dark theme</label>
      <div className="toggle">
        <input
          type="checkbox"
          name="toggleTheme"
          id="toggleTheme"
          className="menu"
          checked={darkTheme}
          onChange={handleThemeToggle}
        />
        <label htmlFor="toggleTheme"></label>
      </div>
    </div>
  );
}

export default ThemeButton;
