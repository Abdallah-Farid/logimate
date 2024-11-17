import React from 'react';
import { useAuth } from '../contexts/AuthContext';

function Navbar() {
  const { user } = useAuth();

  return (
    <nav className="bg-white border-b border-gray-200 px-4 py-2.5">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <span className="text-xl font-semibold text-gray-800">
            Inventory Management
          </span>
        </div>
        <div className="flex items-center">
          <span className="text-sm text-gray-600">
            Welcome, {user?.email}
          </span>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
