"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function NavBar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    window.location.href = "/"; // กลับไปหน้า home
  };

  return (
    <nav className="bg-white/80 backdrop-blur-md shadow-sm w-full sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Site Title/Logo */}
          <Link
            href="/"
            className="text-2xl font-bold text-gray-900 hover:text-indigo-600 transition-colors duration-300"
          >
            Project
          </Link>

          {/* Auth Links */}
          <ul className="flex items-center gap-2 md:gap-4">
            {isLoggedIn ? (
              <>
                <li>
                  <a
                    href="/d"
                    className="text-gray-600 hover:text-gray-900 font-medium transition-colors duration-300 px-3 py-2 rounded-md hover:bg-gray-100"
                  >
                    Dashboard
                  </a>
                </li>
                <li>
                  <button
                    onClick={handleSignOut}
                    className="bg-red-500 hover:bg-red-600 text-white font-medium px-4 py-2 rounded-md transition-all duration-300 shadow-sm hover:shadow-md"
                  >
                    Sign out
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link
                    href="/login"
                    className="text-gray-600 hover:text-gray-900 font-medium transition-colors duration-300 px-3 py-2 rounded-md hover:bg-gray-100"
                  >
                    Sign in
                  </Link>
                </li>
                <li>
                  <Link
                    href="/register"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2 rounded-md transition-all duration-300 shadow-sm hover:shadow-md"
                  >
                    Sign up
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
