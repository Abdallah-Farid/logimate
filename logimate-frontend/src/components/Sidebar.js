import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function Sidebar() {
  const location = useLocation();
  const { user, logout } = useAuth();

  const isActive = (path) => location.pathname === path;

  const navItems = [
    {
      path: '/inventory',
      label: 'Inventory',
      icon: '📦',
      roles: ['admin', 'user']
    }
  ];

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="w-64 h-full bg-white shadow-lg">
      <div className="flex flex-col h-full">
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold text-gray-800">Logimate</h2>
          <p className="text-sm text-gray-600 mt-1">{user?.email}</p>
        </div>

        <nav className="flex-1 p-4">
          {navItems
            .filter(item => !item.roles || item.roles.includes(user?.role))
            .map(item => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-4 py-2 mt-2 text-gray-600 rounded-lg hover:bg-gray-100 ${
                  isActive(item.path) ? 'bg-blue-100 text-blue-700' : ''
                }`}
              >
                <span className="mr-3">{item.icon}</span>
                {item.label}
              </Link>
            ))}
        </nav>

        <div className="p-4 border-t">
          <button
            onClick={handleLogout}
            className="w-full px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg flex items-center"
          >
            <span className="mr-3">🚪</span>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
