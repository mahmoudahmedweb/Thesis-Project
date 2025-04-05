import React from "react";
import { assets } from "../../assets/assets";

const CallToAction = () => {
  return (
    <div className="flex flex-col items-center gap-8 py-20 px-8 bg-white">
      {/* Heading */}
      <h1 className="text-4xl md:text-5xl font-bold text-gray-900 text-center max-w-3xl leading-tight">
        Transform Your Learning Experience
      </h1>

      {/* Description */}
      <p className="text-large text-gray-600 text-center max-w-2xl">
        Join thousands of learners who have achieved their goals with our
        comprehensive courses. Start your journey today.
      </p>

      {/* Statistics Section */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mt-12">
        {/* Statistic 1 */}
        <div className="text-center p-8 bg-white rounded-lg border border-gray-200 hover:border-red-600 transition-all duration-300">
          <h2 className="text-5xl font-bold text-red-600">95%</h2>
          <p className="text-gray-600 mt-4">
            Confidence boost after completing a course.
          </p>
        </div>

        {/* Statistic 2 */}
        <div className="text-center p-8 bg-white rounded-lg border border-gray-200 hover:border-red-600 transition-all duration-300">
          <h2 className="text-5xl font-bold text-red-600">10K+</h2>
          <p className="text-gray-600 mt-4">
            Careers transformed through our platform.
          </p>
        </div>

        {/* Statistic 3 */}
        <div className="text-center p-8 bg-white rounded-lg border border-gray-200 hover:border-red-600 transition-all duration-300">
          <h2 className="text-5xl font-bold text-red-600">4.8/5</h2>
          <p className="text-gray-600 mt-4">
            Average rating from our satisfied students.
          </p>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex items-center gap-6 mt-12">
        <button className="px-8 py-3 rounded-lg text-white bg-red-600 hover:bg-red-700 transition-all duration-300 transform hover:scale-105 shadow-lg">
          Get Started
        </button>
        <button className="flex items-center gap-2 text-red-600 hover:text-red-800 transition-all duration-300">
          Learn More
          <img
            src={assets.arrow_icon}
            alt="arrow_icon"
            className="w-5 h-5 transition-transform duration-300 hover:translate-x-1"
          />
        </button>
      </div>
    </div>
  );
};

export default CallToAction;
