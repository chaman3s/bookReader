// src/components/NavBar.js
import React from 'react';
import { FaHome, FaCog, FaUser } from 'react-icons/fa';

const NavBar = () => {
  return (
    <nav className="bg-gray-800 text-white p-4">
      <ul className="flex justify-between items-center">
        <div className="flex space-x-4">
          <li className="cursor-pointer flex items-center">
            <FaHome className="mr-2" /> Home
          </li>
          <li className="cursor-pointer flex items-center">
            <FaCog className="mr-2" /> Settings
          </li>
          <li className="cursor-pointer flex items-center">
            <FaUser className="mr-2" /> Profile
          </li>
        </div>
        <li>
          <input
            type="text"
            placeholder="Search..."
            className="px-4 py-2 rounded-md bg-gray-700 border-none text-white"
          />
        </li>
      </ul>
    </nav>
  );
};

export default NavBar;
