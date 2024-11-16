import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import config from '../config';

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  const fetchUserAndNotifications = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/');
        return;
      }

      // First fetch user profile to check role
      const userResponse = await axios.get(`${config.apiUrl}/users/profile`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true
      });
      
      const isAdminUser = userResponse.data.role === 'admin';
      setIsAdmin(isAdminUser);

      // Then fetch notifications
      const notifResponse = await axios.get(`${config.apiUrl}/notifications`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true
      });
      
      const notifications = notifResponse.data;

      // If not admin, mark all unread notifications as read automatically
      if (!isAdminUser) {
        const unreadNotifications = notifications.filter(notif => !notif.read);
        if (unreadNotifications.length > 0) {
          await Promise.all(
            unreadNotifications.map(notif =>
              axios.patch(
                `${config.apiUrl}/notifications/${notif.id}`,
                {},
                {
                  headers: { Authorization: `Bearer ${token}` },
                  withCredentials: true
                }
              )
            )
          );
          // Update all notifications to be marked as read in the state
          setNotifications(notifications.map(notif => ({ ...notif, read: true })));
        } else {
          setNotifications(notifications);
        }
      } else {
        setNotifications(notifications);
      }
      
      setError('');
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/');
      } else {
        setError(err.response?.data?.message || 'Failed to fetch notifications');
      }
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchUserAndNotifications();
  }, [fetchUserAndNotifications]);

  const markAsRead = async (id) => {
    if (!isAdmin) return;
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/');
        return;
      }

      await axios.patch(`${config.apiUrl}/notifications/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true
      });
      
      setNotifications((prev) =>
        prev.map((notif) =>
          notif.id === id ? { ...notif, read: true } : notif
        )
      );
      setError('');
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/');
      } else {
        setError(err.response?.data?.message || 'Failed to mark notification as read');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce"></div>
          <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce delay-100"></div>
          <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce delay-200"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 text-center mb-8">Notifications Center</h1>
        
        {error && (
          <div className="p-4 mb-6 text-red-700 bg-red-100 rounded-lg" role="alert">
            {error}
          </div>
        )}

        <div className="bg-white rounded-lg shadow">
          {notifications.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              No notifications to display.
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {notifications.map((notif) => (
                <li
                  key={notif.id}
                  className={`p-6 ${notif.read ? 'bg-gray-50' : 'bg-white'} transition-colors`}
                >
                  <div className="flex flex-col space-y-2">
                    <p className="text-gray-900">{notif.message}</p>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-500">
                        {new Date(notif.createdAt).toLocaleString()}
                      </p>
                      {isAdmin && !notif.read && (
                        <button
                          onClick={() => markAsRead(notif.id)}
                          className="px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                        >
                          Mark as Read
                        </button>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;
