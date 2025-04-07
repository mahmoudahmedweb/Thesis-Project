import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import {
  HomeIcon,
  PlusCircleIcon,
  BookOpenIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";

const SideBar = () => {
  const { isEducator } = useContext(AppContext);

  const menuItems = [
    {
      name: "Dashboard",
      path: "/educator",
      icon: <HomeIcon className="w-5 h-5" />,
    },
    {
      name: "Add Course",
      path: "/educator/add-course",
      icon: <PlusCircleIcon className="w-5 h-5" />,
    },
    {
      name: "My Courses",
      path: "/educator/my-courses",
      icon: <BookOpenIcon className="w-5 h-5" />,
    },
    {
      name: "Students",
      path: "/educator/students-enrolled",
      icon: <UsersIcon className="w-5 h-5" />,
    },
  ];

  return (
    isEducator && (
      <div className="w-64 min-h-screen bg-white border-r border-gray-200 flex flex-col">
        {/* Sidebar Header */}
        <div className="px-6 py-5 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800">
            Educator Portal
          </h2>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-2 py-4 space-y-1">
          {menuItems.map((item) => (
            <NavLink
              to={item.path}
              key={item.name}
              end={item.path === "/educator"}
              className={({ isActive }) =>
                `flex items-center px-4 py-3 text-sm font-medium rounded-lg mx-2 transition-colors duration-200 ${
                  isActive
                    ? "bg-red-50 text-red-600"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`
              }
            >
              <span
                className={`mr-3 ${
                  menuItems.find((i) => i.path === item.path)?.isActive
                    ? "opacity-100"
                    : "opacity-70"
                }`}
              >
                {item.icon}
              </span>
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    )
  );
};

export default SideBar;
