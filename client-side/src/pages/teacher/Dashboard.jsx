import React, { useEffect, useState } from "react";
import { useContext } from "react";
import { AppContext } from "../../context/AppContext";
import { assets, dummyDashboardData } from "../../assets/assets";
import Loading from "../../components/student/Loading";
import {
  AcademicCapIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const { currency } = useContext(AppContext);
  const [currentPage, setCurrentPage] = useState(1);
  const enrollmentsPerPage = 6;

  const fetchDashboardData = async () => {
    setDashboardData(dummyDashboardData);
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Get current enrollments for pagination
  const indexOfLastEnrollment = currentPage * enrollmentsPerPage;
  const indexOfFirstEnrollment = indexOfLastEnrollment - enrollmentsPerPage;
  const currentEnrollments = dashboardData?.enrolledStudentsData?.slice(
    indexOfFirstEnrollment,
    indexOfLastEnrollment
  );
  const totalPages = dashboardData
    ? Math.ceil(dashboardData.enrolledStudentsData.length / enrollmentsPerPage)
    : 1;

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const nextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  return dashboardData ? (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>
        <p className="text-gray-500">
          Welcome back! Here's what's happening today.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Enrollments Card */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Total Enrollments
              </p>
              <p className="text-3xl font-semibold text-gray-800 mt-1">
                {dashboardData.enrolledStudentsData.length}
              </p>
            </div>
            <div className="p-3 rounded-full bg-red-100">
              <UserGroupIcon className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>

        {/* Courses Card */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Courses</p>
              <p className="text-3xl font-semibold text-gray-800 mt-1">
                {dashboardData.totalCourses}
              </p>
            </div>
            <div className="p-3 rounded-full bg-red-100">
              <AcademicCapIcon className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>

        {/* Earnings Card */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Total Earnings
              </p>
              <p className="text-3xl font-semibold text-gray-800 mt-1">
                {currency}
                {dashboardData.totalEarnings.toLocaleString()}
              </p>
            </div>
            <div className="p-3 rounded-full bg-red-100">
              <CurrencyDollarIcon className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Latest Enrollments */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 w-full mx-auto mt-8 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-red-600">
            Latest Enrollments
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-8 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  #
                </th>
                <th
                  scope="col"
                  className="px-8 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Student
                </th>
                <th
                  scope="col"
                  className="px-8 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Course
                </th>
                <th
                  scope="col"
                  className="px-8 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Enrollment Date
                </th>
                <th
                  scope="col"
                  className="px-8 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentEnrollments?.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-8 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {indexOfFirstEnrollment + index + 1}
                  </td>
                  <td className="px-8 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img
                        className="h-10 w-10 rounded-full"
                        src={item.student.imageUrl}
                        alt={item.student.name}
                      />
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {item.student.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {item.student.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 font-medium">
                      {item.courseTitle}
                    </div>
                    <div className="text-sm text-gray-500">
                      {item.courseCategory}
                    </div>
                  </td>
                  <td className="px-8 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.enrollmentDate || "Jan 15, 2023"}
                  </td>
                  <td className="px-8 py-4 whitespace-nowrap">
                    <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Active
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-gray-50">
          <div className="text-sm text-gray-500">
            Showing{" "}
            <span className="font-medium">{indexOfFirstEnrollment + 1}</span> to{" "}
            <span className="font-medium">
              {Math.min(
                indexOfLastEnrollment,
                dashboardData.enrolledStudentsData.length
              )}
            </span>{" "}
            of{" "}
            <span className="font-medium">
              {dashboardData.enrolledStudentsData.length}
            </span>{" "}
            enrollments
          </div>
          <div className="flex space-x-2">
            <button
              onClick={prevPage}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-md border text-sm font-medium ${
                currentPage === 1
                  ? "border-gray-300 text-gray-400 cursor-not-allowed"
                  : "border-gray-300 text-gray-700 hover:bg-gray-100"
              } transition-colors`}
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(
              (number) => (
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
              )
            )}
            <button
              onClick={nextPage}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded-md border text-sm font-medium ${
                currentPage === totalPages
                  ? "border-gray-300 text-gray-400 cursor-not-allowed"
                  : "border-gray-300 text-gray-700 hover:bg-gray-100"
              } transition-colors`}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <Loading />
  );
};

export default Dashboard;
