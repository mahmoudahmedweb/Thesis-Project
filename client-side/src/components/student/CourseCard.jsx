import React, { useContext } from "react";
import { assets } from "../../assets/assets";
import { AppContext } from "../../context/AppContext";
import { Link } from "react-router-dom";

const CourseCard = ({ course }) => {
  const { currency, calculateRating } = useContext(AppContext);

  return (
    <Link
      to={"/course/" + course._id}
      onClick={() => scrollTo(0, 0)}
      className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-xl transition-shadow duration-300 ease-in-out w-full bg-white"
    >
      {/* Image Section */}
      <div className="relative">
        <img
          className="w-full h-48 object-cover"
          src={course.courseThumbnail}
          alt={course.courseTitle}
        />
        {course.discount > 0 && (
          <div className="absolute top-2 right-2 bg-red-600 text-white text-sm px-3 py-1 rounded-full">
            {course.discount}% Off
          </div>
        )}
      </div>

      {/* Course Info */}
      <div className="p-6 flex flex-col space-y-4">
        {/* Title */}
        <h3 className="text-xl font-bold text-gray-900 line-clamp-2">
          {course.courseTitle}
        </h3>

        {/* Educator Name */}
        <p className="text-sm text-gray-600">{course.educator.name}</p>

        {/* Rating Section */}
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1">
            {[...Array(5)].map((_, i) => (
              <img
                key={i}
                src={
                  i < Math.floor(calculateRating(course))
                    ? assets.star
                    : assets.star_blank
                }
                alt="star"
                className="w-4 h-4"
              />
            ))}
          </div>
          <p className="text-sm text-gray-600">
            {calculateRating(course).toFixed(1)} ({course.courseRatings.length}{" "}
            {course.courseRatings.length === 1 ? "review" : "reviews"})
          </p>
        </div>

        {/* Price */}
        <div className="flex items-center space-x-2">
          <p className="text-xl font-bold text-gray-900">
            {currency}
            {(
              course.coursePrice -
              (course.discount * course.coursePrice) / 100
            ).toFixed(2)}
          </p>
          {course.discount > 0 && (
            <p className="text-sm text-gray-500 line-through">
              {currency}
              {course.coursePrice.toFixed(2)}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
};

export default CourseCard;
