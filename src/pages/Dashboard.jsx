import React, { useState, useEffect } from 'react';
import { FaSignOutAlt, FaClock, FaUserClock, FaUsers, FaCheckCircle, FaTimesCircle, FaBell, FaUser, FaCog, FaChevronDown } from 'react-icons/fa';
import axios from 'axios';
import './Dashboard.css';

const Dashboard = ({ user, onLogout }) => {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(false);
  const [punchLoading, setPunchLoading] = useState(false);
  const [error, setError] = useState('');
  const [isPunchedIn, setIsPunchedIn] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    fetchAttendance();
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.notification-container')) {
        setShowNotifications(false);
      }
      if (!event.target.closest('.user-menu-container')) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchAttendance = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:6060/api/attendance', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAttendance(response.data);
      // Check if current user is punched in
      const userAttendance = response.data.find(a => a.username === user.username);
      setIsPunchedIn(!!userAttendance);
    } catch (err) {
      setError('Failed to fetch attendance data');
    } finally {
      setLoading(false);
    }
  };

  const handlePunchIn = async () => {
    setPunchLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:6060/api/attendance/punch-in', {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIsPunchedIn(true);
      fetchAttendance();
      // Add notification
      setNotifications(prev => [...prev, { id: Date.now(), message: 'Successfully punched in!', type: 'success' }]);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to punch in');
      setNotifications(prev => [...prev, { id: Date.now(), message: 'Failed to punch in', type: 'error' }]);
    } finally {
      setPunchLoading(false);
    }
  };

  const handlePunchOut = async () => {
    setPunchLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:6060/api/attendance/punch-out', {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIsPunchedIn(false);
      fetchAttendance();
      // Add notification
      setNotifications(prev => [...prev, { id: Date.now(), message: 'Successfully punched out!', type: 'success' }]);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to punch out');
      setNotifications(prev => [...prev, { id: Date.now(), message: 'Failed to punch out', type: 'error' }]);
    } finally {
      setPunchLoading(false);
    }
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString();
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString();
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  return (
    <div className="dashboard-container">
      <nav className="dashboard-nav">
        <div className="nav-brand">
          <FaClock className="nav-icon" />
          <h2>Attendance Manager</h2>
        </div>
        
        <div className="nav-actions">
          {/* Notifications */}
          <div className="notification-container">
            <button 
              className="notification-btn"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <FaBell />
              {notifications.length > 0 && (
                <span className="notification-badge">{notifications.length}</span>
              )}
            </button>
            
            {showNotifications && (
              <div className="notification-dropdown">
                <div className="notification-header">
                  <h4>Notifications</h4>
                  <button 
                    className="clear-notifications"
                    onClick={() => setNotifications([])}
                  >
                    Clear All
                  </button>
                </div>
                <div className="notification-list">
                  {notifications.length === 0 ? (
                    <div className="no-notifications">No notifications</div>
                  ) : (
                    notifications.map(notification => (
                      <div 
                        key={notification.id} 
                        className={`notification-item ${notification.type}`}
                        onClick={() => removeNotification(notification.id)}
                      >
                        <span>{notification.message}</span>
                        <button className="remove-notification">×</button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Menu */}
          <div className="user-menu-container">
            <button 
              className="user-menu-btn"
              onClick={() => setShowUserMenu(!showUserMenu)}
            >
              <div className="user-avatar">
                <FaUser />
              </div>
              <span className="user-name">{user.username}</span>
              <FaChevronDown className={`chevron ${showUserMenu ? 'rotated' : ''}`} />
            </button>
            
            {showUserMenu && (
              <div className="user-dropdown">
                <div className="user-info">
                  <div className="user-avatar-large">
                    <FaUser />
                  </div>
                  <div className="user-details">
                    <span className="user-full-name">{user.username}</span>
                    <span className="user-email">{user.email}</span>
                  </div>
                </div>
                <div className="dropdown-divider"></div>
                <button className="dropdown-item">
                  <FaUser />
                  Profile
                </button>
                <button className="dropdown-item">
                  <FaCog />
                  Settings
                </button>
                <div className="dropdown-divider"></div>
                <button onClick={onLogout} className="dropdown-item logout-item">
                  <FaSignOutAlt />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      <div className="dashboard-content">
        <div className="dashboard-grid">
          {/* Punch In/Out Card */}
          <div className="dashboard-card card punch-card">
            <div className="card-header">
              <FaUserClock className="card-icon" />
              <h3>Punch In/Out</h3>
            </div>
            
            <div className="current-time">
              <FaClock className="time-icon" />
              <span>{currentTime.toLocaleTimeString()}</span>
            </div>

            <div className="punch-status">
              <div className={`status-indicator ${isPunchedIn ? 'punched-in' : 'punched-out'}`}>
                {isPunchedIn ? <FaCheckCircle /> : <FaTimesCircle />}
                <span>{isPunchedIn ? 'Currently Punched In' : 'Not Punched In'}</span>
              </div>
            </div>

            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            <div className="punch-buttons">
              {!isPunchedIn ? (
                <button
                  onClick={handlePunchIn}
                  disabled={punchLoading}
                  className={`btn btn-success punch-btn ${punchLoading ? 'loading' : ''}`}
                >
                  {punchLoading ? 'Punching In...' : 'Punch In'}
                </button>
              ) : (
                <button
                  onClick={handlePunchOut}
                  disabled={punchLoading}
                  className={`btn btn-danger punch-btn ${punchLoading ? 'loading' : ''}`}
                >
                  {punchLoading ? 'Punching Out...' : 'Punch Out'}
                </button>
              )}
            </div>
          </div>

          {/* Attendance List Card */}
          <div className="dashboard-card card attendance-card">
            <div className="card-header">
              <FaUsers className="card-icon" />
              <h3>Currently Present</h3>
              <button onClick={fetchAttendance} className="refresh-btn">
                ↻
              </button>
            </div>

            <div className="attendance-list">
              {loading ? (
                <div className="loading-message">Loading attendance...</div>
              ) : attendance.length === 0 ? (
                <div className="empty-message">No employees currently present</div>
              ) : (
                attendance.map((record, index) => (
                  <div key={index} className="attendance-item">
                    <div className="employee-info">
                      <div className="employee-name">{record.username}</div>
                      <div className="employee-email">{record.email}</div>
                    </div>
                    <div className="punch-time">
                      <div className="time-label">Punched In:</div>
                      <div className="time-value">
                        {formatTime(record.punchIn)}
                      </div>
                      <div className="date-value">
                        {formatDate(record.punchIn)}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 