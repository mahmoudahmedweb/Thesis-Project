import React, { useContext } from "react";
import { assets } from "../../assets/assets";
import { Link } from "react-router-dom";
import { useClerk, UserButton, useUser } from "@clerk/clerk-react";
import { AppContext } from "../../context/AppContext";

const Header = () => {
  const isCourseListPage = window.location.pathname.includes("/course-list");

  const { navigate, isEducator } = useContext(AppContext);
  const { openSignIn } = useClerk();
  const { user } = useUser();

  return (
    <div
      className={`flex items-center justify-between px-6 sm:px-10 md:px-14 lg:px-24 py-4 shadow-sm transition-colors ${
        isCourseListPage
          ? "bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 border-b border-gray-300"
          : "bg-gradient-to-r from-white via-gray-50 to-white border-b border-gray-300"
      }`}
    >
      {/* Navigation Links */}
      <div className="flex items-center gap-8 text-gray-600">
        <Link
          to="/"
          className="text-lg font-medium hover:text-gray-900 transition-all duration-200 hover:border-b-2 hover:border-red-600"
        >
          Home
        </Link>
        <Link
          to="/course-list"
          className="text-lg font-medium hover:text-gray-900 transition-all duration-200 hover:border-b-2 hover:border-red-600"
        >
          Courses
        </Link>
        <Link
          to="/about"
          className="text-lg font-medium hover:text-gray-900 transition-all duration-200 hover:border-b-2 hover:border-red-600"
        >
          About
        </Link>
        <Link
          to="/contact"
          className="text-lg font-medium hover:text-gray-900 transition-all duration-200 hover:border-b-2 hover:border-red-600"
        >
          Contact
        </Link>
      </div>

      {/* User Actions */}
      <div className="flex items-center gap-6">
        {user && (
          <>
            <button
              className="text-lg font-medium hover:text-gray-900 transition-all duration-200 hover:border-b-2 hover:border-red-600"
              onClick={() => navigate("/teacher")}
            >
              {isEducator ? "Teacher Dashboard" : "Join as a Teacher"}
            </button>
            <Link
              to="/my-enrollments"
              className="text-lg font-medium hover:text-gray-900 transition-all duration-200 hover:border-b-2 hover:border-red-600"
            >
              My Enrollments
            </Link>
          </>
        )}
        {user ? (
          <UserButton />
        ) : (
          <button
            onClick={() => openSignIn()}
            className="bg-red-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-red-700 transition-all hover:shadow-lg"
          >
            Sign In
          </button>
        )}
      </div>
    </div>
  );
};

export default Header;
