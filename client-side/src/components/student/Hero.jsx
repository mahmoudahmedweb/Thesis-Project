import React from "react";
import { assets } from "../../assets/assets";
import SearchBar from "./SearchBar";

const Hero = () => {
  return (
    <div className="relative flex flex-col items-center justify-center w-full pt-32 pb-16 px-5 md:px-16 lg:px-28 bg-gradient-to-br from-gray-50 via-gray-100 to-blue-50 overflow-hidden">
      {/* Background Shapes */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-100 rounded-full opacity-20 transform -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-blue-200 rounded-full opacity-20 transform translate-x-1/3 translate-y-1/3"></div>

      {/* Text Section */}
      <div className="space-y-6 md:space-y-8 text-center z-10">
        <h1 className="text-home-heading-small md:text-home-heading-large font-extrabold text-gray-800 leading-relaxed md:leading-snug">
          Shape your future with courses <br></br>tailored
          <span className="text-red-600"> to your unique aspirations.</span>
        </h1>
        <p className="text-gray-600 text-base md:text-lg leading-relaxed">
          Learn from top industry professionals and unlock your true potential.
          <br></br>Our courses are tailored to provide skills for tomorrow.
        </p>
      </div>

      {/* Icons Section */}
      <div className="flex space-x-10 mt-12">
        <img
          src={assets.web_design_icon}
          alt="Icon 1"
          className="w-12 h-12 cursor-pointer hover:scale-110 transition-transform"
        />
        <img
          src={assets.design_icon}
          alt="Icon 2"
          className="w-12 h-12 cursor-pointer hover:scale-110 transition-transform"
        />
        <img
          src={assets.seo_icon}
          alt="Icon 3"
          className="w-12 h-12 cursor-pointer hover:scale-110 transition-transform"
        />
        <img
          src={assets.data_analysis_icon}
          alt="Icon 4"
          className="w-12 h-12 cursor-pointer hover:scale-110 transition-transform"
        />
      </div>

      <SearchBar />
    </div>
  );
};

export default Hero;
