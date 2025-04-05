import React, { useRef, useState, useEffect } from "react";
import uniqid from "uniqid";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import { assets } from "../../assets/assets";

const AddCourse = () => {
  const quillRef = useRef(null);
  const editorRef = useRef(null);

  const [courseTitle, setCourseTitle] = useState("");
  const [coursePrice, setCoursePrice] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [image, setImage] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [currentChapterId, setCurrentChapterId] = useState(null);
  const [courseCategory, setCourseCategory] = useState("");

  const [lectureDetails, setLectureDetails] = useState({
    lectureTitle: "",
    lectureDuration: "",
    lectureUrl: "",
    isPreviewFree: false,
  });

  useEffect(() => {
    if (!quillRef.current && editorRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: "snow",
        modules: {
          toolbar: [
            [{ header: [1, 2, false] }],
            ["bold", "italic", "underline", "strike"],
            [{ list: "ordered" }, { list: "bullet" }],
            ["link", "image"],
            ["clean"],
          ],
        },
      });
    }
  }, []);

  const addChapter = () => {
    const newChapter = {
      id: uniqid(),
      title: "",
      collapsed: false,
      chapterContent: [],
    };
    setChapters([...chapters, newChapter]);
  };

  const toggleChapter = (chapterId) => {
    setChapters(
      chapters.map((chapter) =>
        chapter.id === chapterId
          ? { ...chapter, collapsed: !chapter.collapsed }
          : chapter
      )
    );
  };

  const addLecture = (chapterId) => {
    setCurrentChapterId(chapterId);
    setShowPopup(true);
  };

  const saveLecture = () => {
    if (!lectureDetails.lectureTitle || !lectureDetails.lectureDuration) return;

    setChapters(
      chapters.map((chapter) =>
        chapter.id === currentChapterId
          ? {
              ...chapter,
              chapterContent: [
                ...chapter.chapterContent,
                {
                  ...lectureDetails,
                  id: uniqid(),
                },
              ],
            }
          : chapter
      )
    );

    setLectureDetails({
      lectureTitle: "",
      lectureDuration: "",
      lectureUrl: "",
      isPreviewFree: false,
    });
    setShowPopup(false);
  };

  const removeChapter = (chapterId) => {
    setChapters(chapters.filter((chapter) => chapter.id !== chapterId));
  };

  const removeLecture = (chapterId, lectureId) => {
    setChapters(
      chapters.map((chapter) =>
        chapter.id === chapterId
          ? {
              ...chapter,
              chapterContent: chapter.chapterContent.filter(
                (lecture) => lecture.id !== lectureId
              ),
            }
          : chapter
      )
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Submit logic here
    console.log({
      courseTitle,
      courseDescription: quillRef.current?.root.innerHTML,
      coursePrice,
      discount,
      image,
      chapters,
      courseCategory,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 overflow-y-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-2">
        Create New Course
      </h1>
      <p className="text-gray-500 mb-6">
        Fill in the details to add a new course
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Course Basic Info Section */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Basic Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Course Title*
              </label>
              <input
                onChange={(e) => setCourseTitle(e.target.value)}
                value={courseTitle}
                type="text"
                placeholder="e.g., Advanced React Development"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Category*
              </label>
              <select
                value={courseCategory}
                onChange={(e) => setCourseCategory(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                required
              >
                <option value="">Select Category</option>
                <option value="Programming">Programming</option>
                <option value="Design">Design</option>
                <option value="Business">Business</option>
                <option value="Marketing">Marketing</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Course Price ($)*
              </label>
              <input
                onChange={(e) => setCoursePrice(e.target.value)}
                value={coursePrice}
                type="number"
                placeholder="0"
                min="0"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
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
                min="0"
                max="100"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              />
            </div>
          </div>

          <div className="mt-4 space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Course Thumbnail*
            </label>
            <div className="flex items-center gap-4">
              <label className="cursor-pointer">
                <div className="p-3 bg-blue-100 rounded-lg hover:bg-blue-200 transition">
                  <img
                    src={assets.file_upload_icon}
                    alt="Upload"
                    className="w-6 h-6"
                  />
                </div>
                <input
                  type="file"
                  id="thumbnailImage"
                  onChange={(e) => setImage(e.target.files[0])}
                  accept="image/*"
                  className="hidden"
                  required
                />
              </label>
              {image && (
                <img
                  className="h-16 w-16 object-cover rounded-lg"
                  src={URL.createObjectURL(image)}
                  alt="Course thumbnail"
                />
              )}
            </div>
          </div>

          <div className="mt-4 space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Course Description*
            </label>
            <div
              ref={editorRef}
              className="min-h-[200px] bg-white border border-gray-300 rounded-lg"
            ></div>
          </div>
        </div>

        {/* Chapters & Lectures Section */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">
              Course Content
            </h2>
            <button
              type="button"
              onClick={addChapter}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Add Chapter
            </button>
          </div>

          {chapters.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <p>No chapters added yet. Click "Add Chapter" to get started.</p>
            </div>
          )}

          {chapters.map((chapter, chapterIndex) => (
            <div
              key={chapter.id}
              className="mb-6 border rounded-lg overflow-hidden"
            >
              <div className="flex justify-between items-center p-4 bg-gray-50">
                <div className="flex items-center">
                  <button
                    type="button"
                    onClick={() => toggleChapter(chapter.id)}
                    className="mr-3 text-gray-500 hover:text-gray-700"
                  >
                    <img
                      src={assets.dropdown_icon}
                      width={14}
                      alt="Toggle"
                      className={`transition-transform ${
                        chapter.collapsed ? "-rotate-90" : ""
                      }`}
                    />
                  </button>
                  <input
                    type="text"
                    placeholder={`Chapter ${chapterIndex + 1} title`}
                    value={chapter.title}
                    onChange={(e) =>
                      setChapters(
                        chapters.map((c) =>
                          c.id === chapter.id
                            ? { ...c, title: e.target.value }
                            : c
                        )
                      )
                    }
                    className="font-medium bg-transparent border-b border-transparent focus:border-gray-300 outline-none"
                    required
                  />
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-500">
                    {chapter.chapterContent.length} lectures
                  </span>
                  <button
                    type="button"
                    onClick={() => addLecture(chapter.id)}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    Add Lecture
                  </button>
                  <button
                    type="button"
                    onClick={() => removeChapter(chapter.id)}
                    className="text-gray-400 hover:text-red-500"
                  >
                    <img
                      src={assets.cross_icon}
                      alt="Remove"
                      className="w-4 h-4"
                    />
                  </button>
                </div>
              </div>

              {!chapter.collapsed && (
                <div className="p-4 divide-y divide-gray-100">
                  {chapter.chapterContent.length === 0 ? (
                    <p className="text-gray-500 text-sm py-2">
                      No lectures in this chapter yet
                    </p>
                  ) : (
                    chapter.chapterContent.map((lecture, lectureIndex) => (
                      <div
                        key={lecture.id}
                        className="py-3 flex justify-between items-center"
                      >
                        <div className="flex items-center">
                          <img
                            src={assets.video_icon}
                            alt="Lecture"
                            className="mr-3 w-5 h-5"
                          />
                          <span>
                            {lecture.lectureTitle ||
                              `Lecture ${lectureIndex + 1}`}
                          </span>
                          {lecture.isPreviewFree && (
                            <span className="ml-2 px-2 py-0.5 text-xs bg-green-100 text-green-800 rounded-full">
                              Free Preview
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm text-gray-500">
                            {lecture.lectureDuration || "0:00"}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              removeLecture(chapter.id, lecture.id)
                            }
                            className="text-gray-400 hover:text-red-500"
                          >
                            <img
                              src={assets.cross_icon}
                              alt="Remove"
                              className="w-4 h-4"
                            />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Form Actions */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Save Course
          </button>
        </div>
      </form>

      {/* Add Lecture Popup */}
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Add Lecture</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Lecture Title*
                </label>
                <input
                  type="text"
                  value={lectureDetails.lectureTitle}
                  onChange={(e) =>
                    setLectureDetails({
                      ...lectureDetails,
                      lectureTitle: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Duration (mm:ss)*
                </label>
                <input
                  type="text"
                  value={lectureDetails.lectureDuration}
                  onChange={(e) =>
                    setLectureDetails({
                      ...lectureDetails,
                      lectureDuration: e.target.value,
                    })
                  }
                  placeholder="e.g., 12:30"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Video URL*
                </label>
                <input
                  type="url"
                  value={lectureDetails.lectureUrl}
                  onChange={(e) =>
                    setLectureDetails({
                      ...lectureDetails,
                      lectureUrl: e.target.value,
                    })
                  }
                  placeholder="https://"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 outline-none"
                  required
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="previewFree"
                  checked={lectureDetails.isPreviewFree}
                  onChange={(e) =>
                    setLectureDetails({
                      ...lectureDetails,
                      isPreviewFree: e.target.checked,
                    })
                  }
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="previewFree"
                  className="ml-2 block text-sm text-gray-700"
                >
                  Available as free preview
                </label>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowPopup(false)}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={saveLecture}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Save Lecture
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddCourse;
