import React, { useState, useEffect } from 'react';
import { FaSignOutAlt, FaClock, FaUserClock, FaUsers, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import axios from 'axios';
import './Dashboard.css';

const Dashboard = ({ user, onLogout }) => {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(false);
  const [punchLoading, setPunchLoading] = useState(false);
  const [error, setError] = useState('');
  const [isPunchedIn, setIsPunchedIn] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    fetchAttendance();
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const fetchAttendance = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/attendance', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAttendance(response.data);
      
      // Check if current user is punched in
      const userAttendance = response.data.find(a => a.username === user.username);
      setIsPunchedIn(!!userAttendance);
    } catch (err) {
      setError('Failed to fetch attendance data');
    }
  };

  const handlePunchIn = async () => {
    setPunchLoading(true);
    setError('');
    
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/attendance/punch-in', {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIsPunchedIn(true);
      fetchAttendance();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to punch in');
    } finally {
      setPunchLoading(false);
    }
  };

  const handlePunchOut = async () => {
    setPunchLoading(true);
    setError('');
    
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/attendance/punch-out', {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIsPunchedIn(false);
      fetchAttendance();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to punch out');
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

  return (
    <div className="dashboard-container">
      <nav className="dashboard-nav">
        <div className="nav-brand">
          <FaClock className="nav-icon" />
          <h2>Attendance Manager</h2>
        </div>
        <div className="nav-user">
          <span>Welcome, {user.username}</span>
          <button onClick={onLogout} className="btn btn-secondary logout-btn">
            <FaSignOutAlt />
            Logout
          </button>
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