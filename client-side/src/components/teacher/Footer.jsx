import React from "react";

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 py-4">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <p className="text-sm text-gray-600">
          © {new Date().getFullYear()} Learnsphere. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
