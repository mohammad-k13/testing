// src/components/ThemeSwitcher.jsx
import React, { useState, useEffect } from "react";

const THEME_KEY = "user-theme";

const ThemeSwitcher = () => {
      const [theme, setTheme] = useState(() => {
            return typeof window !== "undefined" ? localStorage.getItem(THEME_KEY) || "light" : "light";
      });

      useEffect(() => {
            if (typeof window !== "undefined") {
                  localStorage.setItem(THEME_KEY, theme);
                  document.body.className = theme;
            }
      }, [theme]);

      const toggleTheme = () => {
            setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
      };

      return (
            <div data-testid="theme-switcher">
                  <p>Current Theme: {theme}</p>
                  <button onClick={toggleTheme}>Toggle Theme</button>
            </div>
      );
};

export default ThemeSwitcher;
