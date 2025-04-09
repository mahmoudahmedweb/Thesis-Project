import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Line } from "rc-progress";
import { AppContext } from "../../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const MyEnrollments = () => {
  const {
    enrolledCourses,
    calculateCourseDuration,
    calculateNoOfLectures,
    navigate,
    userData,
    backendUrl,
    getToken,
    fetchUserEnrolledCourses,
  } = useContext(AppContext);

  const [progressArray, setProgressArray] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const getCourseProgress = async () => {
    try {
      setIsLoading(true);
      const token = await getToken();
      const tempProgressArray = await Promise.all(
        enrolledCourses.map(async (course) => {
          const { data } = await axios.post(
            `${backendUrl}/api/user/get-course-progress`,
            { courseId: course._id },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          let totalLectures = calculateNoOfLectures(course);
          const lectureCompleted = data.progressData
            ? data.progressData.lectureCompleted.length
            : 0;
          return { totalLectures, lectureCompleted };
        })
      );
      setProgressArray(tempProgressArray);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (userData) {
      fetchUserEnrolledCourses();
    }
  }, [userData]);

  useEffect(() => {
    if (enrolledCourses.length > 0) {
      getCourseProgress();
    } else {
      setIsLoading(false);
    }
  }, [enrolledCourses]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="md:px-36 px-8 pt-10 min-h-screen">
      <h1 className="text-2xl font-semibold">My Enrollments</h1>

      {enrolledCourses.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-600 mb-4">
            You haven't enrolled in any courses yet
          </p>
          <button
            onClick={() => navigate("/course-list")}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Browse Courses
          </button>
        </div>
      ) : (
        <table className="md:table-auto table-fixed w-full overflow-hidden border mt-10">
          <thead className="text-gray-900 border-b border-gray-500/20 text-sm text-left max-sm:hidden">
            <tr>
              <th className="px-4 py-3 font-semibold truncate">Course</th>
              <th className="px-4 py-3 font-semibold truncate">Duration</th>
              <th className="px-4 py-3 font-semibold truncate">Completed</th>
              <th className="px-4 py-3 font-semibold truncate">Status</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {enrolledCourses.map((course, index) => {
              const progress = progressArray[index]
                ? (progressArray[index].lectureCompleted * 100) /
                  progressArray[index].totalLectures
                : 0;

              return (
                <tr
                  key={index}
                  className="border-b border-gray-500/20 hover:bg-gray-50"
                >
                  <td className="md:px-4 pl-2 md:pl-4 py-3 flex items-center space-x-3">
                    <img
                      src={course.courseThumbnail}
                      alt={course.courseTitle}
                      className="w-14 sm:w-24 md:w-28 rounded"
                    />
                    <div className="flex-1">
                      <p className="mb-1 max-sm:text-sm">
                        {course.courseTitle}
                      </p>
                      <Line
                        strokeWidth={2}
                        percent={progress}
                        strokeColor="#3B82F6"
                        className="w-full"
                      />
                    </div>
                  </td>
                  <td className="px-4 py-3 max-sm:hidden">
                    {calculateCourseDuration(course)}
                  </td>
                  <td className="px-4 py-3 max-sm:hidden">
                    {progressArray[index] &&
                      `${progressArray[index].lectureCompleted}/${progressArray[index].totalLectures}`}
                    <span> Lectures</span>
                  </td>
                  <td className="px-4 py-3 max-sm:text-right">
                    <button
                      onClick={() => navigate("/player/" + course._id)}
                      className={`px-3 sm:px-5 py-1.5 sm:py-2 max-sm:text-xs text-white rounded ${
                        progress === 100 ? "bg-green-600" : "bg-blue-600"
                      }`}
                    >
                      {progress === 100 ? "Completed" : "Continue"}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default MyEnrollments;
