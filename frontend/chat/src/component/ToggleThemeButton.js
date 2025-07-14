import React from 'react';
import { useTheme } from '../ThemeContext';

export default function ToggleThemeButton() {
  const { darkMode, toggleTheme } = useTheme();

  return (
    <button onClick={toggleTheme} style={{ margin: '1rem', padding: '0.5rem' }}>
      {darkMode ? ' Light Mode' : ' Dark Mode'}
    </button>
  );
}
