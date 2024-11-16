import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const isActive = (path) => {
    return location.pathname === path ? 'bg-blue-700' : '';
  };

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          {/* Logo and brand */}
          <div className="flex items-center">
            <Link to="/profile" className="flex items-center space-x-3">
              <span className="text-xl font-bold">LogiMate</span>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center space-x-1">
            <Link
              to="/profile"
              className={`px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors ${isActive('/profile')}`}
            >
              Profile
            </Link>
            <Link
              to="/inventory"
              className={`px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors ${isActive('/inventory')}`}
            >
              Inventory
            </Link>
            <Link
              to="/notifications"
              className={`px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors ${isActive('/notifications')}`}
            >
              Notifications
            </Link>
            <button
              onClick={handleLogout}
              className="ml-4 px-4 py-2 rounded-md text-sm font-medium bg-red-500 hover:bg-red-600 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
