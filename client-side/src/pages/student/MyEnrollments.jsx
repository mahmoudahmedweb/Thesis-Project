import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../context/AppContext";

const MyEnrollments = () => {
  const { enrolledCourses, calculateCourseDuration } = useContext(AppContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [coursesWithProgress, setCoursesWithProgress] = useState([]);
  const navigate = useNavigate();

  // Load progress from localStorage and calculate course progress
  useEffect(() => {
    const updatedCourses = enrolledCourses.map((course) => {
      const savedProgress = localStorage.getItem(
        `courseProgress_${course._id}`
      );
      const completedLectures = savedProgress
        ? JSON.parse(savedProgress).length
        : 0;

      const totalLectures = course.courseContent.reduce(
        (sum, chapter) => sum + chapter.chapterContent.length,
        0
      );

      const progress =
        totalLectures > 0
          ? Math.round((completedLectures / totalLectures) * 100)
          : 0;

      return {
        ...course,
        progress,
        completedLectures,
        totalLectures,
      };
    });

    setCoursesWithProgress(updatedCourses);
  }, [enrolledCourses]);

  // Filter courses based on search term
  const filteredCourses = coursesWithProgress.filter((course) =>
    course.courseTitle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Determine status based on progress
  const getStatus = (progress) => {
    if (progress === 0) return "Not Started";
    if (progress < 50) return "In Progress";
    if (progress < 100) return "Almost Done";
    return "Completed";
  };

  // Handle course title click
  const handleCourseClick = (courseId) => {
    navigate(`/course/${courseId}`);
  };

  // Handle status badge click - navigate to player page
  const handleStatusClick = (courseId) => {
    navigate(`/player/${courseId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header with Search */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4 sm:mb-0">
            My Enrollments
          </h1>
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
            <svg
              className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        {/* Courses Table */}
        {filteredCourses.length > 0 ? (
          <div className="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200">
            {/* Table Headers */}
            <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-gray-50 border-b border-gray-200 text-sm font-medium text-gray-700">
              <div className="col-span-5">Course</div>
              <div className="col-span-2">Duration</div>
              <div className="col-span-3">Progress</div>
              <div className="col-span-2">Status</div>
            </div>

            {/* Courses List */}
            <div className="divide-y divide-gray-200">
              {filteredCourses.map((course, index) => {
                const status = getStatus(course.progress);

                return (
                  <div
                    key={index}
                    className="grid grid-cols-12 gap-4 items-center px-6 py-4 hover:bg-gray-50 transition-colors"
                  >
                    {/* Course Info */}
                    <div className="col-span-5 flex items-center">
                      <img
                        src={course.courseThumbnail}
                        alt={course.courseTitle}
                        className="w-12 h-12 rounded-md object-cover mr-4"
                      />
                      <div>
                        <h3
                          className="text-sm font-medium text-gray-900 line-clamp-1 hover:text-red-600 cursor-pointer transition-colors"
                          onClick={() => handleCourseClick(course._id)}
                        >
                          {course.courseTitle}
                        </h3>
                        <p className="text-xs text-gray-500">
                          {course.completedLectures}/{course.totalLectures}{" "}
                          lectures
                        </p>
                      </div>
                    </div>

                    {/* Duration */}
                    <div className="col-span-2 text-sm text-gray-600">
                      {calculateCourseDuration(course)}
                    </div>

                    {/* Progress */}
                    <div className="col-span-3">
                      <div className="flex items-center">
                        <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
                          <div
                            className="bg-red-600 h-2 rounded-full"
                            style={{ width: `${course.progress}%` }}
                          ></div>
                        </div>
                        <span className="text-xs font-medium text-gray-700">
                          {course.progress}%
                        </span>
                      </div>
                    </div>

                    {/* Status - Now clickable */}
                    <div className="col-span-2">
                      <button
                        onClick={() => handleStatusClick(course._id)}
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          status === "Completed"
                            ? "bg-green-100 text-green-800 hover:bg-green-200"
                            : status === "Almost Done"
                            ? "bg-blue-100 text-blue-800 hover:bg-blue-200"
                            : status === "In Progress"
                            ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                            : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                        } transition-colors`}
                      >
                        {status}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">
              No courses found
            </h3>
            <p className="mt-1 text-gray-500">
              {searchTerm
                ? "Try a different search term"
                : "You haven't enrolled in any courses yet"}
            </p>
            <button
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              onClick={() => navigate("/course-list")}
            >
              Browse Courses
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyEnrollments;
