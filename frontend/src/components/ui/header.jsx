import React, { useState } from 'react';

const Header = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark', !isDarkMode);
  };

  return (
       <header className="fixed top-0 left-0 w-full backdrop-blur-sm ">
  <div className="container mx-auto flex justify-between items-center py-3 px-4 max-w-5xl">
        <div>
          <span role="img" aria-label="logo" className="text-2xl">
          🦘
          </span>
        </div>
        <div>
          <h1 className="text-xl font-semibold dark:text-white">Australian Visa Tracker</h1>
        </div>
        <div>
          <button
            onClick={toggleDarkMode}
            className="focus:outline-none"
          >
            {isDarkMode ? '☀️' : '🌙'}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;