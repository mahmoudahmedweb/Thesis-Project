import React from "react";
import { Outlet } from "react-router-dom";
import NavBar from "../../components/teacher/NavBar";
import Sidebar from "../../components/teacher/SideBar";
import Footer from "../../components/teacher/Footer";

const Teacher = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />

      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1">
          <Outlet />
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default Teacher;
