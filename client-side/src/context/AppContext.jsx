import { createContext, useEffect, useState } from "react";
import { dummyCourses } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import humanizeDuration from "humanize-duration";
export const AppContext = createContext();

export const AppContextProvider = (props) => {
  const currency = import.meta.env.VITE_CURRENCY;

  const navigate = useNavigate();
  const [allCourses, setAllCourses] = useState([]);
  const [isEducator, setIsEducator] = useState(true);
  const [enrolledCourses, setEnrolledCourses] = useState([]);

  // Fetching All Courses
  const fetchAllCourses = async () => {
    setAllCourses(dummyCourses);
  };

  // Calculating Average rating of the course
  const calculateRating = (course) => {
    const ratings = course.courseRatings.map((rating) => rating.rating);
    if (ratings.length === 0) return 0; // If no ratings, return 0.
    const total = ratings.reduce((acc, rating) => acc + rating, 0);
    return total / ratings.length; // Return the average rating.
  };

  // Caclulating Course Chapter Time

  const calculateChapterTime = (chapter) => {
    let time = 0;
    chapter.chapterContent.map((lecture) => (time += lecture.lectureDuration));
    return humanizeDuration(time * 60 * 1000, { units: ["h", "m"] });
  };

  // Caclulating Total Course Duration

  const calculateCourseDuration = (course) => {
    let time = 0;
    course.courseContent.map((chapter) =>
      chapter.chapterContent.map((lecture) => (time += lecture.lectureDuration))
    );
    return humanizeDuration(time * 60 * 1000, { units: ["h", "m"] });
  };

  // Calculating the number of lectures in the course

  const calculateNoOfLectures = (course) => {
    let totalLectures = 0;
    course.courseContent.forEach((chapter) => {
      if (Array.isArray(chapter.chapterContent)) {
        totalLectures += chapter.chapterContent.length;
      }
    });
    return totalLectures;
  };

  // Fetching user enrolled courses
  const fetchEnrolledCourses = async () => {
    // Fetch the enrolled courses from the API
    setEnrolledCourses(dummyCourses);
  };
  useEffect(() => {
    fetchAllCourses();
    fetchEnrolledCourses();
  }, []);

  const value = {
    currency,
    allCourses,
    navigate,
    calculateRating,
    isEducator,
    setIsEducator,
    calculateNoOfLectures,
    calculateCourseDuration,
    calculateChapterTime,
    enrolledCourses,
    fetchEnrolledCourses,
  };

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};
