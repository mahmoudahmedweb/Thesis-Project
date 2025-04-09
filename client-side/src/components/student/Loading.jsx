import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FiLoader } from "react-icons/fi";

const Loading = () => {
  const { path } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (path) {
      const timer = setTimeout(() => {
        navigate(`/${path}`);
      }, 5000);

      return () => clearTimeout(timer);
    }
  });
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <FiLoader className="animate-spin text-4xl text-red-600" />
      <p className="text-lg text-gray-600">Loading your content...</p>
      <div className="w-48 h-1 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-red-600 animate-pulse"
          style={{ width: "70%" }}
        />
      </div>
    </div>
  );
};

export default Loading;
