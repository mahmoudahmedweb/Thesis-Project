import React from "react";
import { useContext, useState, useEffect } from "react";
import { AppContext } from "../../context/AppContext";
import Loading from "../../components/student/Loading";
import axios from "axios";
import { toast } from "react-toastify";
import {
  AcademicCapIcon,
  CurrencyDollarIcon,
  UsersIcon,
  CalendarIcon,
} from "@heroicons/react/24/outline";

const MyCourses = () => {
  const { currency, backendUrl, isEducator, getToken } = useContext(AppContext);
  const [courses, setCourses] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const coursesPerPage = 6;

  const fetchCourses = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get(backendUrl + "/api/educator/courses", {
        headers: { Authorization: `Bearer ${token}` },
      });

      data.success && setCourses(data.courses);
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (isEducator) {
      fetchCourses();
    }
  }, [isEducator]);

  // Get current courses for pagination
  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = courses
    ? courses.slice(indexOfFirstCourse, indexOfLastCourse)
    : [];
  const totalPages = courses ? Math.ceil(courses.length / coursesPerPage) : 1;

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const nextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  return courses ? (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">My Courses</h1>
        <p className="text-gray-500">
          Manage and track your course performance
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Courses</p>
              <p className="text-3xl font-semibold text-gray-800 mt-1">
                {courses.length}
              </p>
            </div>
            <div className="p-3 rounded-full bg-blue-100">
              <AcademicCapIcon className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Total Students
              </p>
              <p className="text-3xl font-semibold text-gray-800 mt-1">
                {courses.reduce(
                  (sum, course) => sum + course.enrolledStudents.length,
                  0
                )}
              </p>
            </div>
            <div className="p-3 rounded-full bg-green-100">
              <UsersIcon className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Total Earnings
              </p>
              <p className="text-3xl font-semibold text-gray-800 mt-1">
                {currency}
                {courses
                  .reduce(
                    (sum, course) =>
                      sum +
                      Math.floor(
                        course.enrolledStudents.length *
                          (course.coursePrice -
                            (course.discount * course.coursePrice) / 100)
                      ),
                    0
                  )
                  .toLocaleString()}
              </p>
            </div>
            <div className="p-3 rounded-full bg-purple-100">
              <CurrencyDollarIcon className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Course Cards Grid - Now showing only current page courses */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentCourses.map((course) => (
          <div
            key={course._id}
            className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow overflow-hidden"
          >
            {/* Course Image */}
            <div className="h-40 overflow-hidden">
              <img
                className="w-full h-full object-cover"
                src={course.courseThumbnail}
                alt={course.courseTitle}
              />
            </div>

            {/* Course Info */}
            <div className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    {course.courseTitle}
                  </h3>
                  <span className="inline-block mt-1 px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-600">
                    {course.courseCategory}
                  </span>
                </div>
                <span className="px-2 py-1 text-sm font-medium rounded-full bg-green-100 text-green-800">
                  {course.enrolledStudents.length} students
                </span>
              </div>

              <div className="mt-4 space-y-3">
                <div className="flex items-center text-sm text-gray-600">
                  <CurrencyDollarIcon className="w-4 h-4 mr-2 text-gray-400" />
                  <span>
                    {currency}
                    {Math.floor(
                      course.enrolledStudents.length *
                        (course.coursePrice -
                          (course.discount * course.coursePrice) / 100)
                    ).toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <CalendarIcon className="w-4 h-4 mr-2 text-gray-400" />
                  <span>
                    Published on{" "}
                    {new Date(course.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Enhanced Pagination */}
      <div className="mt-8 flex justify-center items-center">
        <nav className="flex items-center space-x-2">
          <button
            onClick={prevPage}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-md border border-gray-300 text-sm font-medium ${
              currentPage === 1
                ? "text-gray-400 cursor-not-allowed"
                : "text-gray-700 hover:bg-gray-100"
            } transition-colors`}
          >
            Previous
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
            <button
              key={number}
              onClick={() => paginate(number)}
              className={`px-4 py-2 rounded-md border text-sm font-medium ${
                currentPage === number
                  ? "border-gray-300 bg-gray-100 text-gray-700"
                  : "border-gray-300 text-gray-700 hover:bg-gray-100"
              }`}
            >
              {number}
            </button>
          ))}

          <button
            onClick={nextPage}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded-md border border-gray-300 text-sm font-medium ${
              currentPage === totalPages
                ? "text-gray-400 cursor-not-allowed"
                : "text-gray-700 hover:bg-gray-100"
            } transition-colors`}
          >
            Next
          </button>
        </nav>
      </div>
    </div>
  ) : (
    <Loading />
  );
};

export default MyCourses;
