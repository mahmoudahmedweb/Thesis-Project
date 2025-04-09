import React from "react";

import { Route, Routes, useMatch } from "react-router-dom";
import Home from "./pages/student/Home";
import CourseDetails from "./pages/student/CourseDetails";
import MyEnrollments from "./pages/student/MyEnrollments";
import CoursesList from "./pages/student/CoursesList";
import VideoPlayer from "./pages/student/VideoPlayer";
import Loading from "./components/student/Loading";
import Teacher from "./pages/teacher/Teacher";
import Dashboard from "./pages/teacher/Dashboard";
import AddCourse from "./pages/teacher/AddCourse";
import MyCourses from "./pages/teacher/MyCourses";
import StudentsEnrolled from "./pages/teacher/StudentsEnrolled";
import Header from "./components/student/Header";
import "quill/dist/quill.snow.css";
import { ToastContainer } from "react-toastify";

const App = () => {
  const isTeacherRoute = useMatch("/teacher/*");

  return (
    <div className="text-default min-h-screen bg-white">
      <ToastContainer />
      {!isTeacherRoute && <Header />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/course-list" element={<CoursesList />} />
        <Route path="/course-list/:input" element={<CoursesList />} />
        <Route path="/course/:id" element={<CourseDetails />} />
        <Route path="/my-enrollments" element={<MyEnrollments />} />
        <Route path="/player/:courseId" element={<VideoPlayer />} />
        <Route path="/loading/:path" element={<Loading />} />
        <Route path="/educator" element={<Teacher />}>
          <Route path="/educator" element={<Dashboard />} />
          <Route path="add-course" element={<AddCourse />} />
          <Route path="my-courses" element={<MyCourses />} />
          <Route path="students-enrolled" element={<StudentsEnrolled />} />
        </Route>
        <Route path="/dashboard" element={<Teacher />} />
      </Routes>
    </div>
  );
};

export default App;
