import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Loading from "../../components/student/Loading";
import { AppContext } from "../../context/AppContext";
import { assets } from "../../assets/assets";
import humanizeDuration from "humanize-duration";
import Footer from "../../components/student/Footer";
import YouTube from "react-youtube";
import axios from "axios";
import { toast } from "react-toastify";
const CourseDetails = () => {
  const { id } = useParams();

  const [courseData, setCourseData] = useState(null);
  const [openSections, setOpenSections] = useState({});
  const [isAlreadyEnrolled, setIsAlreadyEnrolled] = useState(false);

  const {
    allCourses,
    calculateRating,
    calculateNoOfLectures,
    calculateCourseDuration,
    calculateChapterTime,
    currency,
    backendUrl,
    userData,
    getToken,
  } = useContext(AppContext);

  const fetchCourseData = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/course/" + id);

      if (data.success) {
        setCourseData(data.courseData);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const enrollCourse = async () => {
    try {
      if (!userData) {
        return toast.warn("Login to Enroll");
      }
      if (isAlreadyEnrolled) {
        return toast.warn("Already Enrolled");
      }
      const token = await getToken();

      const { data } = await axios.post(
        backendUrl + "/api/user/purchase",
        { courseId: courseData._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        const { session_url } = data;
        window.location.replace(session_url);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchCourseData();
  }, []);

  useEffect(() => {
    if (userData && courseData) {
      setIsAlreadyEnrolled(userData.enrolledCourses.includes(courseData._id));
    }
  }, [userData, courseData]);
  const toggleSection = (index) => {
    setOpenSections((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  return courseData ? (
    <div
      style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
    >
      <div style={{ flex: 1 }}>
        <div className="flex flex-col md:flex-row gap-12 md:px-12 lg:px-32 px-6 py-12 bg-gray-50">
          {/* Left Column - Course Details */}
          <div className="flex-1">
            {/* Course Title */}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              {courseData.courseTitle}
            </h1>

            {/* Course Description (Short) */}
            <p
              className="text-gray-600 mb-8 text-lg leading-relaxed"
              dangerouslySetInnerHTML={{
                __html: courseData.courseDescription.slice(0, 200) + "...",
              }}
            ></p>

            {/* Rating and Enrollment */}
            <div className="flex items-center gap-4 mb-8">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <img
                    key={i}
                    src={
                      i < Math.floor(calculateRating(courseData))
                        ? assets.star
                        : assets.star_blank
                    }
                    alt="star"
                    className="w-5 h-5"
                  />
                ))}
                <span className="text-sm text-gray-600">
                  {calculateRating(courseData).toFixed(1)} (
                  {courseData.courseRatings.length}{" "}
                  {courseData.courseRatings.length === 1 ? "review" : "reviews"}
                  )
                </span>
              </div>
              <span className="text-sm text-gray-600">
                {courseData.enrolledStudents.length}{" "}
                {courseData.enrolledStudents.length === 1
                  ? "student"
                  : "students"}
              </span>
              <span className="text-sm text-gray-600">
                By{" "}
                <span className="text-red-600 underline">
                  Mahmoud Ahmed Ramadan
                </span>
              </span>
            </div>

            {/* Course Structure */}
            <div className="mb-12">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                Course Structure
              </h2>
              <div className="space-y-4">
                {courseData.courseContent.map((chapter, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow duration-300"
                  >
                    <div
                      className="flex items-center justify-between p-5 cursor-pointer"
                      onClick={() => toggleSection(index)}
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={assets.down_arrow_icon}
                          alt="arrow icon"
                          className={`w-5 h-5 transition-transform ${
                            openSections[index] ? "rotate-180" : ""
                          }`}
                        />
                        <p className="font-medium text-gray-800 text-lg">
                          {chapter.chapterTitle}
                        </p>
                      </div>
                      <p className="text-sm text-gray-600">
                        {chapter.chapterContent.length} lectures -{" "}
                        {calculateChapterTime(chapter)}
                      </p>
                    </div>
                    <div
                      className={`overflow-hidden transition-all duration-300 ${
                        openSections[index] ? "max-h-96" : "max-h-0"
                      }`}
                    >
                      <ul className="list-disc pl-12 pr-6 py-4 border-t border-gray-200">
                        {chapter.chapterContent.map((lecture, i) => (
                          <li key={i} className="flex items-start gap-3 py-3">
                            <img
                              src={assets.play_icon}
                              alt="play icon"
                              className="w-5 h-5 mt-1"
                            />
                            <div className="flex-1 flex items-center justify-between text-gray-800">
                              <p className="text-sm md:text-base">
                                {lecture.lectureTitle}
                              </p>
                              <div className="flex items-center gap-3">
                                {lecture.isPreviewFree && (
                                  <p className="text-blue-500 text-sm cursor-pointer hover:underline">
                                    Preview
                                  </p>
                                )}
                                <p className="text-sm text-gray-600">
                                  {humanizeDuration(
                                    lecture.lectureDuration * 60 * 1000,
                                    {
                                      units: ["h", "m"],
                                    }
                                  )}
                                </p>
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Full Course Description */}
            <div className="mb-12">
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">
                Course Description
              </h3>
              <p
                className="text-gray-600 text-lg leading-relaxed rich-text"
                dangerouslySetInnerHTML={{
                  __html: courseData.courseDescription,
                }}
              ></p>
            </div>
          </div>

          {/* Right Column - Course Card */}
          <div className="w-full md:w-96">
            <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-100">
              {/* Course Thumbnail */}
              <img
                src={courseData.courseThumbnail}
                alt={courseData.courseTitle}
                className="w-full h-56 object-cover"
              />

              {/* Course Details */}
              <div className="p-6">
                {/* Discount Banner */}
                <div className="flex items-center gap-2 mb-4 bg-red-50 p-3 rounded-lg">
                  <p className="text-red-600 font-medium text-sm">
                    5 days left at this price!
                  </p>
                </div>

                {/* Price Section */}
                <div className="flex items-center gap-3 mb-6">
                  <p className="text-3xl font-bold text-gray-900">
                    {currency}
                    {(
                      courseData.coursePrice -
                      (courseData.discount * courseData.coursePrice) / 100
                    ).toFixed(2)}
                  </p>
                  <p className="text-lg text-gray-500 line-through">
                    {currency}
                    {courseData.coursePrice.toFixed(2)}
                  </p>
                  <p className="text-lg text-red-600 font-medium">
                    {courseData.discount}% off
                  </p>
                </div>

                {/* Course Stats */}
                <div className="flex items-center gap-4 text-sm text-gray-600 mb-6">
                  <div className="flex items-center gap-1">
                    <img
                      src={assets.star}
                      alt="star icon"
                      className="w-5 h-5"
                    />
                    <p>{calculateRating(courseData)}</p>
                  </div>
                  <div className="h-4 w-px bg-gray-300"></div>
                  <div className="flex items-center gap-1">
                    <img
                      src={assets.time_clock_icon}
                      alt="clock icon"
                      className="w-5 h-5"
                    />
                    <p>{calculateCourseDuration(courseData)}</p>
                  </div>
                  <div className="h-4 w-px bg-gray-300"></div>
                  <div className="flex items-center gap-1">
                    <img
                      src={assets.time_clock_icon}
                      alt="clock icon"
                      className="w-5 h-5"
                    />
                    <p>{calculateNoOfLectures(courseData)} lessons</p>
                  </div>
                </div>

                {/* Enroll Button */}
                <button
                  onClick={enrollCourse}
                  className="w-full mt-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-300 font-semibold text-lg"
                >
                  {isAlreadyEnrolled ? "Already Enrolled" : "Enroll Now"}
                </button>

                {/* Course Features */}
                <div className="mt-6">
                  <p className="text-lg font-semibold text-gray-900 mb-4">
                    What's in the course?
                  </p>
                  <ul className="space-y-2 text-gray-600">
                    {[1, 2].map((item, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <span className="text-red-600">•</span>
                        <span>Lifetime access with free updates.</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  ) : (
    <Loading />
  );
};

export default CourseDetails;
