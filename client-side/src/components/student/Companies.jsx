import React from "react";
import { assets } from "../../assets/assets";

const Companies = () => {
  return (
    <div className="pt-4">
      {" "}
      {/* Reduced padding-top */}
      <p className="text-base text-gray-500 mb-4">Our learners work for</p>{" "}
      {/* Added margin bottom */}
      <div className="flex flex-wrap items-center justify-center gap-6 md:gap-12">
        {" "}
        {/* Adjusted gap */}
        <div className="bg-blue-100 p-4 rounded-lg">
          {" "}
          {/* Example background color */}
          <img
            src={assets.microsoft_logo}
            alt="Microsoft"
            className="w-20 md:w-28"
          />
        </div>
        <div className="bg-blue-100 p-4 rounded-lg">
          {" "}
          {/* Example background color */}
          <img
            src={assets.walmart_logo}
            alt="Walmart"
            className="w-20 md:w-28"
          />
        </div>
        <div className="bg-blue-100 p-4 rounded-lg">
          {" "}
          {/* Example background color */}
          <img
            src={assets.accenture_logo}
            alt="Accenture"
            className="w-20 md:w-28"
          />
        </div>
        <div className="bg-blue-100 p-4 rounded-lg">
          {" "}
          {/* Example background color */}
          <img src={assets.adobe_logo} alt="Adobe" className="w-20 md:w-28" />
        </div>
        <div className="bg-blue-100 p-4 rounded-lg">
          {" "}
          {/* Example background color */}
          <img src={assets.paypal_logo} alt="PayPal" className="w-20 md:w-28" />
        </div>
      </div>
    </div>
  );
};

export default Companies;
