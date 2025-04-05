import React from "react";
import { UserButton, useUser } from "@clerk/clerk-react";

const NavBar = () => {
  const { user } = useUser();

  return (
    <nav className="bg-white border-b border-gray-200 py-3 px-6">
      <div className="flex items-center justify-between">
        {/* Website Title - Matches Sidebar header styling */}
        <div className="flex items-center">
          <h1 className="text-lg font-semibold text-gray-800">Learnsphere</h1>
        </div>

        {/* User Profile - Minimalist version */}
        <div className="flex items-center">
          {user && (
            <div className="ml-2">
              <UserButton
                appearance={{
                  elements: {
                    userButtonAvatarBox: "w-8 h-8 border border-gray-200",
                    userButtonPopoverCard:
                      "shadow-lg rounded-lg border border-gray-200",
                  },
                }}
              />
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
