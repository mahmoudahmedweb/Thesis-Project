import React, { useContext, useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import { assets } from "../../assets/assets";
import humanizeDuration from "humanize-duration";
import YouTube from "react-youtube";
import Footer from "../../components/student/Footer";

const VideoPlayer = () => {
  const { enrolledCourses, calculateChapterTime, submitCourseRating } =
    useContext(AppContext);
  const { courseId } = useParams();
  const [courseData, setCourseData] = useState(null);
  const [openSections, setOpenSections] = useState({});
  const [playerData, setPlayerData] = useState(null);
  const [completedLectures, setCompletedLectures] = useState([]);
  const [progress, setProgress] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [reviewText, setReviewText] = useState("");
  const playerRef = useRef(null);

  // Load course data
  useEffect(() => {
    enrolledCourses.forEach((course) => {
      if (course._id === courseId) {
        setCourseData(course);
        // Check if user has already rated this course
        const userRating = course.courseRatings.find(
          (r) => r.userId === "currentUserId"
        ); // Replace with actual user ID
        if (userRating) {
          setRating(userRating.rating);
        }
      }
    });
  }, [courseId, enrolledCourses]);

  // Calculate progress
  useEffect(() => {
    if (courseData) {
      const totalLectures = courseData.courseContent.reduce(
        (total, chapter) => total + chapter.chapterContent.length,
        0
      );
      const completed = completedLectures.length;
      setProgress(Math.round((completed / totalLectures) * 100));
    }
  }, [completedLectures, courseData]);

  // Save progress to localStorage
  useEffect(() => {
    if (completedLectures.length > 0) {
      localStorage.setItem(
        `courseProgress_${courseId}`,
        JSON.stringify(completedLectures)
      );
    }
  }, [completedLectures, courseId]);

  // Load saved progress
  useEffect(() => {
    const savedProgress = localStorage.getItem(`courseProgress_${courseId}`);
    if (savedProgress) {
      setCompletedLectures(JSON.parse(savedProgress));
    }
  }, [courseId]);

  const toggleSection = (index) =>
    setOpenSections((prev) => ({ ...prev, [index]: !prev[index] }));

  const toggleComplete = (chapterIndex, lectureIndex) => {
    const lectureId = `${chapterIndex}-${lectureIndex}`;
    setCompletedLectures((prev) =>
      prev.includes(lectureId)
        ? prev.filter((id) => id !== lectureId)
        : [...prev, lectureId]
    );
  };

  const findAdjacentLecture = (direction) => {
    if (!courseData || !playerData) return null;

    let found = false;

    for (let i = 0; i < courseData.courseContent.length; i++) {
      const chapter = courseData.courseContent[i];

      for (let j = 0; j < chapter.chapterContent.length; j++) {
        const lecture = chapter.chapterContent[j];

        if (found) {
          return {
            ...lecture,
            chapter: i + 1,
            lecture: j + 1,
          };
        }

        if (playerData.chapter === i + 1 && playerData.lecture === j + 1) {
          found = true;
        }
      }
    }

    return null;
  };

  const onPlayerReady = (event) => {
    playerRef.current = event.target;
    playerRef.current.setPlaybackRate(playbackRate);
  };

  const handleRatingSubmit = () => {
    if (rating > 0) {
      submitCourseRating(courseId, rating, reviewText);
      setShowRatingModal(false);
      setReviewText("");
    }
  };

  const calculateAverageRating = () => {
    if (
      !courseData ||
      !courseData.courseRatings ||
      courseData.courseRatings.length === 0
    ) {
      return 0;
    }
    const sum = courseData.courseRatings.reduce(
      (total, r) => total + r.rating,
      0
    );
    return (sum / courseData.courseRatings.length).toFixed(1);
  };

  return courseData ? (
    <div
      style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
    >
      <div style={{ flex: 1 }}>
        <div className="flex flex-col lg:flex-row gap-8 px-6 md:px-12 lg:px-24 py-8 bg-gray-50">
          {/* Left Column - Video Player */}
          <div className="flex-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              {playerData ? (
                <>
                  <YouTube
                    videoId={playerData.lectureUrl.split("/").pop()}
                    opts={{
                      playerVars: {
                        autoplay: 1,
                        controls: 1,
                        rel: 0,
                        modestbranding: 1,
                      },
                    }}
                    onReady={onPlayerReady}
                    iframeClassName="w-full aspect-video"
                  />
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <span className="text-red-600 font-medium">
                          Chapter {playerData.chapter} • Lecture{" "}
                          {playerData.lecture}
                        </span>
                        <h2 className="text-2xl font-bold text-gray-900 mt-1">
                          {playerData.lectureTitle}
                        </h2>
                      </div>
                      <button
                        onClick={() =>
                          toggleComplete(
                            playerData.chapter - 1,
                            playerData.lecture - 1
                          )
                        }
                        className={`px-4 py-2 rounded-lg font-medium text-sm ${
                          completedLectures.includes(
                            `${playerData.chapter - 1}-${
                              playerData.lecture - 1
                            }`
                          )
                            ? "bg-green-100 text-green-700 border border-green-200"
                            : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                        }`}
                      >
                        {completedLectures.includes(
                          `${playerData.chapter - 1}-${playerData.lecture - 1}`
                        )
                          ? "Completed ✓"
                          : "Mark Complete"}
                      </button>
                    </div>

                    {/* Playback Controls */}
                    <div className="flex items-center gap-4 mt-4">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">Speed:</span>
                        <select
                          value={playbackRate}
                          onChange={(e) => {
                            const rate = parseFloat(e.target.value);
                            setPlaybackRate(rate);
                            if (playerRef.current) {
                              playerRef.current.setPlaybackRate(rate);
                            }
                          }}
                          className="bg-gray-100 border border-gray-300 text-gray-700 py-1 px-2 rounded text-sm"
                        >
                          {[0.5, 0.75, 1, 1.25, 1.5, 2].map((speed) => (
                            <option key={speed} value={speed}>
                              {speed}x
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Lecture Description */}
                    {playerData.lectureDescription && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <h3 className="font-semibold text-lg text-gray-900 mb-2">
                          About this lecture
                        </h3>
                        <p className="text-gray-600">
                          {playerData.lectureDescription}
                        </p>
                      </div>
                    )}

                    {/* Course Rating (only shown when video is playing) */}
                    {playerData && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-lg text-gray-900">
                            Course Rating
                          </h3>
                          <span className="text-sm text-gray-600">
                            {courseData.courseRatings.length} ratings
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <svg
                                key={star}
                                className={`w-6 h-6 cursor-pointer ${
                                  star <=
                                  (hoverRating ||
                                    rating ||
                                    calculateAverageRating())
                                    ? "text-yellow-400"
                                    : "text-gray-300"
                                }`}
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                onMouseEnter={() => setHoverRating(star)}
                                onMouseLeave={() => setHoverRating(0)}
                                onClick={() => {
                                  setRating(star);
                                  setShowRatingModal(true);
                                }}
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                          <span className="text-sm font-medium text-gray-700">
                            {calculateAverageRating()} out of 5
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Navigation Buttons */}
                    <div className="flex justify-between mt-6">
                      <button
                        onClick={() => {
                          const prevLecture = findAdjacentLecture(-1);
                          if (prevLecture) setPlayerData(prevLecture);
                        }}
                        className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm"
                      >
                        ← Previous
                      </button>
                      <button
                        onClick={() => {
                          const nextLecture = findAdjacentLecture(1);
                          if (nextLecture) setPlayerData(nextLecture);
                        }}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm"
                      >
                        Next →
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="aspect-video bg-gray-100 flex items-center justify-center">
                  <div className="text-center p-8">
                    <img
                      src={courseData.courseThumbnail}
                      alt="Course thumbnail"
                      className="mx-auto rounded-lg max-h-64 object-cover mb-4 border border-gray-200"
                    />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      Select a lecture to begin
                    </h2>
                    <p className="text-gray-600 max-w-lg mx-auto">
                      Choose from the course content to start learning.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Course Content */}
          <div className="w-full lg:w-96">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-xl font-bold text-gray-900">
                    Course Content
                  </h2>
                  <span className="text-xs bg-gray-100 rounded-full px-2 py-1 text-gray-600">
                    {progress}% Complete
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                  <div
                    className="bg-red-600 h-2 rounded-full"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600">
                  {courseData.courseContent.length} chapters •{" "}
                  {courseData.courseContent.reduce(
                    (acc, chapter) => acc + chapter.chapterContent.length,
                    0
                  )}{" "}
                  lectures
                </p>
              </div>

              <div className="overflow-y-auto max-h-[calc(100vh-200px)]">
                {courseData.courseContent.map((chapter, index) => (
                  <div
                    key={index}
                    className="border-b border-gray-200 last:border-0"
                  >
                    <div
                      className="flex justify-between items-center p-4 hover:bg-gray-50 cursor-pointer"
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
                        <span className="font-medium text-gray-900">
                          {chapter.chapterTitle}
                        </span>
                      </div>
                      <span className="text-xs bg-gray-100 rounded-full px-2 py-1 text-gray-600">
                        {chapter.chapterContent.length} lectures
                      </span>
                    </div>

                    <div
                      className={`transition-all duration-300 ${
                        openSections[index] ? "block" : "hidden"
                      }`}
                    >
                      <ul className="pb-2">
                        {chapter.chapterContent.map((lecture, i) => (
                          <li
                            key={i}
                            className={`mx-2 rounded-lg transition-colors ${
                              playerData?.chapter === index + 1 &&
                              playerData?.lecture === i + 1
                                ? "bg-red-50 border border-red-100"
                                : "hover:bg-gray-50"
                            }`}
                          >
                            <div
                              className="flex items-center justify-between p-3 cursor-pointer"
                              onClick={() =>
                                setPlayerData({
                                  ...lecture,
                                  chapter: index + 1,
                                  lecture: i + 1,
                                })
                              }
                            >
                              <div className="flex items-center gap-3">
                                <div
                                  className={`w-5 h-5 rounded-full flex items-center justify-center ${
                                    completedLectures.includes(`${index}-${i}`)
                                      ? "bg-green-100 text-green-600"
                                      : "bg-gray-100 text-gray-400"
                                  }`}
                                >
                                  {completedLectures.includes(
                                    `${index}-${i}`
                                  ) ? (
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="h-3 w-3"
                                      viewBox="0 0 20 20"
                                      fill="currentColor"
                                    >
                                      <path
                                        fillRule="evenodd"
                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                        clipRule="evenodd"
                                      />
                                    </svg>
                                  ) : (
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="h-3 w-3"
                                      viewBox="0 0 20 20"
                                      fill="currentColor"
                                    >
                                      <path
                                        fillRule="evenodd"
                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                        clipRule="evenodd"
                                      />
                                    </svg>
                                  )}
                                </div>
                                <span
                                  className={`text-sm ${
                                    playerData?.chapter === index + 1 &&
                                    playerData?.lecture === i + 1
                                      ? "text-red-600 font-medium"
                                      : "text-gray-700"
                                  }`}
                                >
                                  {lecture.lectureTitle}
                                </span>
                              </div>
                              <span className="text-xs text-gray-500">
                                {humanizeDuration(
                                  lecture.lectureDuration * 60 * 1000,
                                  { units: ["h", "m"] }
                                )}
                              </span>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />

      {/* Rating Modal */}
      {showRatingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900">
                Rate This Course
              </h3>
              <button
                onClick={() => setShowRatingModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="flex justify-center mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg
                  key={star}
                  className={`w-10 h-10 cursor-pointer ${
                    star <= (hoverRating || rating)
                      ? "text-yellow-400"
                      : "text-gray-300"
                  }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(star)}
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <textarea
              className="w-full p-3 border border-gray-300 rounded-lg mb-4"
              rows="3"
              placeholder="Share your experience (optional)"
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
            />
            <button
              onClick={handleRatingSubmit}
              disabled={rating === 0}
              className={`w-full py-2 px-4 rounded-lg font-medium ${
                rating === 0
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-red-600 hover:bg-red-700 text-white"
              }`}
            >
              Submit Rating
            </button>
          </div>
        </div>
      )}
    </div>
  ) : (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <p className="text-gray-600 mb-4">Loading course content...</p>
      </div>
    </div>
  );
};

export default VideoPlayer;
