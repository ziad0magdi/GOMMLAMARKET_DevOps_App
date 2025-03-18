import React, { useState, useContext } from "react";
import UserContext from "../../context/AppContext";
import "./SearchBar.css";

const SearchBar = ({ onSearch, searchText }) => {
  const { isDarkMode } = useContext(AppContext);
  const [query, setQuery] = useState("");

  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };

  const handleSearch = () => {
    if (onSearch) onSearch(query);
  };

  return (
    <div className={`SearchBar_container ${isDarkMode ? "dark" : "light"}`}>
      <input
        type="text"
        className={`SearchBar_input ${isDarkMode ? "dark" : "light"}`}
        placeholder={searchText}
        value={query}
        onChange={handleInputChange}
      />
      <button
        className={`SearchBar_button ${isDarkMode ? "dark" : "light"}`}
        onClick={handleSearch}
      >
        🔍
      </button>
    </div>
  );
};

export default SearchBar;
