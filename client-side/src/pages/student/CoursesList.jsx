import React, { useContext, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SearchBar from "../../components/student/SearchBar";
import { AppContext } from "../../context/AppContext";
import CourseCard from "../../components/student/CourseCard";
import { assets } from "../../assets/assets";
import Footer from "../../components/student/Footer";

const CoursesList = () => {
  const { allCourses } = useContext(AppContext);
  const { input } = useParams(); // Get the 'input' from the URL params
  const navigate = useNavigate();
  const [filteredCourse, setFilteredCourse] = useState([]);

  useEffect(() => {
    if (allCourses && allCourses.length > 0) {
      const tempCourses = allCourses.slice(); // Copy the courses array
      if (input) {
        // Filter courses based on the search input
        setFilteredCourse(
          tempCourses.filter((item) =>
            item.courseTitle.toLowerCase().includes(input.toLowerCase())
          )
        );
      } else {
        setFilteredCourse(tempCourses); // Show all courses if no search input
      }
    }
  }, [allCourses, input]); // Re-run this effect when `allCourses` or `input` changes

  const clearSearch = () => {
    // Navigate to the same page without the search input (i.e., reset the query)
    navigate("/course-list");
  };

  return (
    <div className="relative px-6 md:px-20 pt-16 md:pt-20 bg-gray-50 min-h-screen text-left">
      {/* Page Title and Search Bar Section */}
      <div className="flex flex-col md:flex-row items-center md:items-center justify-between gap-8 w-full">
        {/* Page Title and Breadcrumb */}
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            Course List
          </h1>
          <p className="text-sm md:text-base text-gray-600 mt-2">
            <span
              className="text-red-600 hover:underline cursor-pointer"
              onClick={() => navigate("/")}
            >
              Home
            </span>{" "}
            / <span className="text-gray-700">Course List</span>
          </p>
        </div>

        {/* Search Bar */}
        <div className="ml-auto w-full md:w-1/3">
          <SearchBar data={input} />
        </div>
      </div>

      {input && (
        <div className="inline-flex items-center gap-4 px-4 py-2 border mt-8 -mb-8 text-gray-600">
          <p>{input}</p>
          <img
            src={assets.cross_icon}
            alt="clear-search"
            className="cursor-pointer"
            onClick={clearSearch} // Call clearSearch to reset the URL
          />
        </div>
      )}

      {/* Courses Grid Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 my-16 px-2 md:p-0">
        {filteredCourse.length > 0 ? (
          filteredCourse.map((course, index) => (
            <CourseCard key={index} course={course} />
          ))
        ) : (
          <p>No courses found.</p>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default CoursesList;
