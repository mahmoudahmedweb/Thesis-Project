import React, { useState, useEffect } from "react";
import Loading from "../../components/student/Loading";
import { dummyStudentEnrolled } from "../../assets/assets";
import {
  AcademicCapIcon,
  CalendarIcon,
  EnvelopeIcon,
} from "@heroicons/react/24/outline";

const StudentsEnrolled = () => {
  const [enrolledStudents, setEnrolledStudents] = useState(null);

  const fetchEnrolledStudents = async () => {
    // Replace this with your actual data fetching logic
    // Example: const response = await fetch('/api/enrolled-students');
    // const data = await response.json();
    // setEnrolledStudents(data);

    setEnrolledStudents(dummyStudentEnrolled);
  };

  useEffect(() => {
    fetchEnrolledStudents();
  }, []);

  return enrolledStudents ? (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Enrolled Students</h1>
        <p className="text-gray-500">
          {enrolledStudents.length} students enrolled in your courses
        </p>
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Student
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Course
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Enrollment Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {enrolledStudents.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img
                        className="h-10 w-10 rounded-full object-cover"
                        src={item.student.imageUrl}
                        alt={item.student.name}
                      />
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {item.student.name}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center">
                          <EnvelopeIcon className="w-4 h-4 mr-1" />
                          {item.student.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 flex items-center">
                      <AcademicCapIcon className="w-4 h-4 mr-2 text-gray-400" />
                      {item.courseTitle}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500 flex items-center">
                      <CalendarIcon className="w-4 h-4 mr-2 text-gray-400" />
                      {new Date(item.enrollmentDate).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        }
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-gray-50">
          <div className="text-sm text-gray-500">
            Showing <span className="font-medium">1</span> to{" "}
            <span className="font-medium">{enrolledStudents.length}</span> of{" "}
            <span className="font-medium">{enrolledStudents.length}</span>{" "}
            students
          </div>
        </div>
      </div>
    </div>
  ) : (
    <Loading />
  );
};

export default StudentsEnrolled;
