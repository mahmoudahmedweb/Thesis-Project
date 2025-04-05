import React, { useState } from "react";
import { assets } from "../../assets/assets";
import { useNavigate } from "react-router-dom";

const SearchBar = ({ data }) => {
  const navigate = useNavigate();

  // Ensure 'data' is a string or access the specific property if it's an object
  const [input, setInput] = useState(data || ""); // Initialize with the passed 'data'
  const [isFocused, setIsFocused] = useState(false); // Track focus state

  const onSearchHandler = (e) => {
    e.preventDefault();
    // Update the URL with the new search input
    navigate(`/course-list/${input}`);
  };

  return (
    <div className="w-full max-w-lg mt-8">
      <form
        onSubmit={onSearchHandler}
        className="w-full md:h-14 h-12 flex items-center bg-white border border-gray-500/20 rounded"
      >
        <img
          src={assets.search_icon}
          alt="search_icon"
          className="md:w-auto w-10 px-3"
        />
        <input
          onChange={(e) => setInput(e.target.value)}
          value={input}
          type="text"
          placeholder={isFocused ? "" : "Browse our courses"} // Placeholder disappears when focused
          className="w-full h-full outline-none text-gray-500/80 px-3"
          onFocus={() => setIsFocused(true)} // When input is focused
          onBlur={() => setIsFocused(false)} // When input loses focus
        />
        <button
          type="submit"
          className="bg-red-600 rounded text-white md:px-10 px-7 md:py-3 py-2 mx-1 hover:bg-gray-800 transition-colors duration-200 ease-in-out"
        >
          Search
        </button>
      </form>
    </div>
  );
};

export default SearchBar;
