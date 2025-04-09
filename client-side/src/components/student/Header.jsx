import React, { useContext, useState } from "react";
import { assets } from "../../assets/assets";
import { Link } from "react-router-dom";
import { useClerk, UserButton, useUser } from "@clerk/clerk-react";
import { AppContext } from "../../context/AppContext";
import { FiMenu, FiX } from "react-icons/fi";
import axios from "axios";
import { toast } from "react-toastify";
const Header = () => {
  const isCourseListPage = window.location.pathname.includes("/course-list");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { navigate, isEducator, backendUrl, setIsEducator, getToken } =
    useContext(AppContext);
  const { openSignIn } = useClerk();
  const { user } = useUser();

  const becomeEducator = async () => {
    try {
      if (isEducator) {
        navigate("/educator");
        return;
      }
      const token = await getToken();
      const { data } = await axios.get(
        backendUrl + "/api/educator/update-role",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        setIsEducator(true);
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
  return (
    <header
      className={`relative w-full px-4 sm:px-6 md:px-10 lg:px-24 py-4 shadow-sm transition-colors ${
        isCourseListPage
          ? "bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 border-b border-gray-300"
          : "bg-gradient-to-r from-white via-gray-50 to-white border-b border-gray-300"
      }`}
    >
      <div className="flex items-center justify-between max-w-screen-xl mx-auto">
        {/* Mobile menu button - only visible on small screens */}
        <div className="lg:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-gray-700 hover:text-gray-900 focus:outline-none"
          >
            {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>

        {/* Navigation Links - hidden on mobile when menu is closed */}
        <nav
          className={`${
            mobileMenuOpen
              ? "absolute top-full left-0 right-0 bg-white shadow-lg z-50 p-4 flex flex-col space-y-4"
              : "hidden lg:flex items-center gap-6 lg:gap-8"
          }`}
        >
          <Link
            to="/"
            className="block text-lg font-medium hover:text-gray-900 transition-all duration-200 hover:border-b-2 hover:border-red-600 py-2 lg:py-0"
            onClick={() => setMobileMenuOpen(false)}
          >
            Home
          </Link>
          <Link
            to="/course-list"
            className="block text-lg font-medium hover:text-gray-900 transition-all duration-200 hover:border-b-2 hover:border-red-600 py-2 lg:py-0"
            onClick={() => setMobileMenuOpen(false)}
          >
            Courses
          </Link>
          <Link
            to="/about"
            className="block text-lg font-medium hover:text-gray-900 transition-all duration-200 hover:border-b-2 hover:border-red-600 py-2 lg:py-0"
            onClick={() => setMobileMenuOpen(false)}
          >
            About
          </Link>
          <Link
            to="/contact"
            className="block text-lg font-medium hover:text-gray-900 transition-all duration-200 hover:border-b-2 hover:border-red-600 py-2 lg:py-0"
            onClick={() => setMobileMenuOpen(false)}
          >
            Contact
          </Link>

          {/* Mobile-only user actions */}
          {mobileMenuOpen && (
            <div className="lg:hidden flex flex-col space-y-4 pt-4 border-t border-gray-200">
              {user && (
                <>
                  <button
                    className="text-lg font-medium hover:text-gray-900 transition-all duration-200 hover:border-b-2 hover:border-red-600 text-left py-2"
                    onClick={() => {
                      navigate("/educator");
                      setMobileMenuOpen(false);
                    }}
                  >
                    {isEducator ? "Teacher Dashboard" : "Join as a Teacher"}
                  </button>
                  <Link
                    to="/my-enrollments"
                    className="text-lg font-medium hover:text-gray-900 transition-all duration-200 hover:border-b-2 hover:border-red-600 py-2 block"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    My Enrollments
                  </Link>
                </>
              )}
              {user ? (
                <div className="py-2">
                  <UserButton />
                </div>
              ) : (
                <button
                  onClick={() => {
                    openSignIn();
                    setMobileMenuOpen(false);
                  }}
                  className="bg-red-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-red-700 transition-all hover:shadow-lg w-full text-left"
                >
                  Sign In
                </button>
              )}
            </div>
          )}
        </nav>

        {/* User Actions - hidden on mobile when menu is open */}
        <div
          className={`${
            mobileMenuOpen ? "hidden lg:flex" : "flex"
          } items-center gap-4 sm:gap-6`}
        >
          {user && (
            <>
              <button
                className="hidden lg:block text-lg font-medium hover:text-gray-900 transition-all duration-200 hover:border-b-2 hover:border-red-600"
                onClick={becomeEducator}
              >
                {isEducator ? "Teacher Dashboard" : "Join as a Teacher"}
              </button>
              <Link
                to="/my-enrollments"
                className="hidden lg:block text-lg font-medium hover:text-gray-900 transition-all duration-200 hover:border-b-2 hover:border-red-600"
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
              className="hidden lg:block bg-red-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-red-700 transition-all hover:shadow-lg"
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
