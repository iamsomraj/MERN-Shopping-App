import { MoonIcon, SunIcon } from '@heroicons/react/20/solid';
import { useState, useEffect } from 'react';

const ThemeToggleButton = () => {
  const preferredTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

  const [isDarkMode, setIsDarkMode] = useState(localStorage.getItem('theme') || preferredTheme);

  useEffect(() => {
    // Update the class on the HTML element based on the theme
    if (isDarkMode === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // Save the theme preference to local storage
    localStorage.setItem('theme', isDarkMode);
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(isDarkMode === 'dark' ? 'light' : 'dark');
  };

  if (isDarkMode === 'dark') {
    return (
      <SunIcon
        className='h-6 w-6 rounded-full text-zinc-100'
        role='button'
        onClick={() => toggleTheme()}
      />
    );
  } else {
    return (
      <MoonIcon
        className='h-6 w-6 rounded-full text-zinc-900'
        role='button'
        onClick={() => toggleTheme()}
      />
    );
  }
};

export default ThemeToggleButton;
