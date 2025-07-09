const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/punch-in', authMiddleware, attendanceController.punchIn);
router.post('/punch-out', authMiddleware, attendanceController.punchOut);
router.get('/', authMiddleware, attendanceController.getAttendance);
router.get('/late-arrivals', authMiddleware, attendanceController.getLateArrivals);
router.get('/early-leaves', authMiddleware, attendanceController.getEarlyLeaves);

module.exports = router; 