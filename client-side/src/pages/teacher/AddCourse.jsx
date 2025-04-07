import React, { useRef, useState, useEffect } from "react";
import uniqid from "uniqid";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import { assets } from "../../assets/assets";

const AddCourse = () => {
  const quillRef = useRef(null);
  const editorRef = useRef(null);
  const fileInputRef = useRef(null);

  const [courseTitle, setCourseTitle] = useState("");
  const [coursePrice, setCoursePrice] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [image, setImage] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [currentChapterId, setCurrentChapterId] = useState(null);
  const [lectureDetails, setLectureDetails] = useState({
    lectureTitle: "",
    lectureDuration: "",
    lectureUrl: "",
    isPreviewFree: false,
  });

  const handleChapter = (action, chapterId) => {
    if (action === "add") {
      const title = prompt("Enter Chapter Name: ");
      if (title) {
        const newChapter = {
          chapterId: uniqid(),
          chapterTitle: title,
          chapterContent: [],
          collapsed: false,
          chapterOrder:
            chapters.length > 0 ? chapters.slice(-1)[0].chapterOrder + 1 : 1,
        };
        setChapters([...chapters, newChapter]);
      }
    } else if (action === "remove") {
      setChapters(
        chapters.filter((chapter) => chapter.chapterId !== chapterId)
      );
    } else if (action === "toggle") {
      setChapters(
        chapters.map((chapter) =>
          chapter.chapterId === chapterId
            ? { ...chapter, collapsed: !chapter.collapsed }
            : chapter
        )
      );
    }
  };

  const handleLecture = (action, chapterId, lectureIndex) => {
    if (action === "add") {
      setCurrentChapterId(chapterId);
      setShowPopup(true);
    } else if (action === "remove") {
      setChapters(
        chapters.map((chapter) => {
          if (chapter.chapterId === chapterId) {
            chapter.chapterContent.splice(lectureIndex, 1);
          }
          return chapter;
        })
      );
    }
  };

  const handleAddLecture = () => {
    if (
      !lectureDetails.lectureTitle ||
      !lectureDetails.lectureDuration ||
      !lectureDetails.lectureUrl
    ) {
      alert("Please fill all required fields");
      return;
    }

    setChapters(
      chapters.map((chapter) => {
        if (chapter.chapterId === currentChapterId) {
          chapter.chapterContent.push({
            ...lectureDetails,
            lectureId: uniqid(),
          });
        }
        return chapter;
      })
    );

    setLectureDetails({
      lectureTitle: "",
      lectureDuration: "",
      lectureUrl: "",
      isPreviewFree: false,
    });
    setShowPopup(false);
  };

  const addLecture = () => {
    setChapters(
      chapters.map((chapter) => {
        if (chapter.chapterId === currentChapterId) {
          const newLecture = {
            ...lectureDetails,
            lectureOrder:
              chapter.chapterContent.length > 0
                ? chapter.chapterContent.slice(-1)[0].lectureOrder + 1
                : 1,
            lectureId: uniqid(),
          };
          chapter.chapterContent.push(newLecture);
        }
        return chapter;
      })
    );
    setShowPopup(false);
    setLectureDetails({
      lectureTitle: "",
      lectureDuration: "",
      lectureUrl: "",
      isPreviewFree: false,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  };
  useEffect(() => {
    if (!quillRef.current && editorRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: "snow",
        modules: {
          toolbar: [
            [{ header: [1, 2, false] }],
            ["bold", "italic", "underline"],
            ["link", "blockquote", "code-block"],
            [{ list: "ordered" }, { list: "bullet" }],
          ],
        },
      });
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Create New Course
        </h1>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Course Title */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Course Title
            </label>
            <input
              type="text"
              onChange={(e) => setCourseTitle(e.target.value)}
              value={courseTitle}
              placeholder="Enter course title"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Course Description */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Course Description
            </label>
            <div
              ref={editorRef}
              className="min-h-[200px] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></div>
          </div>

          {/* Price and Thumbnail */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Course Price ($)
              </label>
              <input
                type="number"
                onChange={(e) => setCoursePrice(e.target.value)}
                value={coursePrice}
                placeholder="0"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Discount (%)
              </label>
              <input
                onChange={(e) => setDiscount(e.target.value)}
                value={discount}
                type="number"
                placeholder="0"
                min={0}
                max={100}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          {/* Thumbnail Upload */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Course Thumbnail
            </label>
            <div className="flex items-center gap-4">
              <label className="cursor-pointer">
                <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-md p-4 hover:border-blue-500 transition-colors">
                  {image ? (
                    <img
                      src={URL.createObjectURL(image)}
                      alt="Course thumbnail"
                      className="h-24 object-cover rounded-md"
                    />
                  ) : (
                    <>
                      <img
                        src={assets.file_upload_icon}
                        alt="Upload"
                        className="h-10 mb-2"
                      />
                      <span className="text-sm text-gray-500">
                        Click to upload
                      </span>
                    </>
                  )}
                </div>
                <input
                  type="file"
                  id="thumbnailImage"
                  onChange={(e) => setImage(e.target.files[0])}
                  accept="image/*"
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Chapters and Lectures */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-800">
              Course Content
            </h2>

            {chapters.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No chapters added yet. Click below to add your first chapter.
              </div>
            )}

            {chapters.map((chapter, chapterIndex) => (
              <div
                key={chapter.chapterId}
                className="border rounded-lg overflow-hidden"
              >
                <div className="flex justify-between items-center p-4 bg-gray-50 border-b">
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => handleChapter("toggle", chapter.chapterId)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <img
                        src={assets.dropdown_icon}
                        width={14}
                        alt="Toggle"
                        className={`transition-transform ${
                          chapter.collapsed ? "rotate-90" : ""
                        }`}
                      />
                    </button>
                    <div>
                      <h3 className="font-medium">
                        {chapterIndex + 1}. {chapter.chapterTitle}
                      </h3>
                      <p className="text-xs text-gray-500">
                        {chapter.chapterContent.length} lecture
                        {chapter.chapterContent.length !== 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleLecture("add", chapter.chapterId)}
                      className="text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                    >
                      Add Lecture
                    </button>
                    <button
                      onClick={() => handleChapter("remove", chapter.chapterId)}
                      className="text-gray-500 hover:text-red-500"
                    >
                      <img src={assets.cross_icon} alt="Remove" width={16} />
                    </button>
                  </div>
                </div>

                {!chapter.collapsed && chapter.chapterContent.length > 0 && (
                  <div className="p-4 space-y-2">
                    {chapter.chapterContent.map((lecture, lectureIndex) => (
                      <div
                        key={lectureIndex}
                        className="flex justify-between items-center p-2 bg-gray-50 rounded"
                      >
                        <div>
                          <p className="font-medium">
                            {chapterIndex + 1}.{lectureIndex + 1}{" "}
                            {lecture.lectureTitle}
                          </p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span>{lecture.lectureDuration} min</span>
                            <a
                              href={lecture.lectureUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-500 hover:underline"
                            >
                              View Link
                            </a>
                            {lecture.isPreviewFree && (
                              <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded">
                                Free Preview
                              </span>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={() =>
                            handleLecture(
                              "remove",
                              chapter.chapterId,
                              lectureIndex
                            )
                          }
                          className="text-gray-400 hover:text-red-500"
                        >
                          <img
                            src={assets.cross_icon}
                            alt="Remove"
                            width={14}
                          />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}

            <button
              type="button"
              onClick={() => handleChapter("add")}
              className="w-full py-2 border-2 border-dashed border-gray-300 rounded-md hover:border-blue-500 hover:bg-blue-50 transition-colors flex items-center justify-center space-x-2"
            >
              <span>+</span>
              <span>Add Chapter</span>
            </button>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2.5 px-6 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              Create Course
            </button>
          </div>
        </form>
      </div>

      {/* Add Lecture Popup */}
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  Add New Lecture
                </h3>
                <button
                  onClick={() => setShowPopup(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <img src={assets.cross_icon} alt="Close" width={16} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Lecture Title
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={lectureDetails.lectureTitle}
                    onChange={(e) =>
                      setLectureDetails({
                        ...lectureDetails,
                        lectureTitle: e.target.value,
                      })
                    }
                    placeholder="Enter lecture title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Duration (minutes)
                  </label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={lectureDetails.lectureDuration}
                    onChange={(e) =>
                      setLectureDetails({
                        ...lectureDetails,
                        lectureDuration: e.target.value,
                      })
                    }
                    placeholder="Enter duration in minutes"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Lecture URL
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={lectureDetails.lectureUrl}
                    onChange={(e) =>
                      setLectureDetails({
                        ...lectureDetails,
                        lectureUrl: e.target.value,
                      })
                    }
                    placeholder="Enter video URL"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="previewFree"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    checked={lectureDetails.isPreviewFree}
                    onChange={(e) =>
                      setLectureDetails({
                        ...lectureDetails,
                        isPreviewFree: e.target.checked,
                      })
                    }
                  />
                  <label
                    htmlFor="previewFree"
                    className="ml-2 block text-sm text-gray-700"
                  >
                    Available as free preview
                  </label>
                </div>
              </div>

              <div className="mt-6">
                <button
                  type="button"
                  onClick={addLecture}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                >
                  Add Lecture
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddCourse;
