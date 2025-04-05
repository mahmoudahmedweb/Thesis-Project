import React, { useContext } from "react";
import { Link } from "react-router-dom";
import CourseCard from "./CourseCard";
import { AppContext } from "../../context/AppContext";

const ContentSection = () => {
  const { allCourses } = useContext(AppContext);

  return (
    <div className="py-16 px-8 md:px-12 lg:px-24 bg-gray-50 w-full">
      {/* Updated Heading */}
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          Explore Top Courses
        </h2>
        <p className="text-lg text-gray-600 leading-relaxed">
          Discover our top-rated courses across various categories. From coding
          and design to business and wellness, our courses are crafted to
          deliver results.
        </p>
      </div>

      {/* Responsive Grid with 3 cards per row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
        {allCourses.slice(0, 6).map((course, index) => (
          <CourseCard key={index} course={course} />
        ))}
      </div>

      {/* Updated Button */}
      <div className="text-center mt-12">
        <Link
          to={"/course-list"}
          onClick={() => scrollTo(0, 0)}
          className="inline-block bg-red-600 text-white px-8 py-3 rounded-lg shadow-lg hover:bg-red-700 transition-all duration-300 ease-in-out transform hover:scale-105"
        >
          Show all Courses
        </Link>
      </div>
    </div>
  );
};

export default ContentSection;
