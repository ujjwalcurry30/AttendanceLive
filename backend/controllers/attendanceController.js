const Attendance = require('../models/Attendance');

exports.punchIn = async (req, res) => {
  try {
    const userId = req.user.userId;
    // Check if already punched in
    const existing = await Attendance.findOne({ user: userId, punchOut: null });
    if (existing) {
      return res.status(400).json({ message: 'Already punched in' });
    }
    const attendance = new Attendance({ user: userId });
    await attendance.save();
    res.status(201).json({ message: 'Punched in successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.punchOut = async (req, res) => {
  try {
    const userId = req.user.userId;
    const attendance = await Attendance.findOne({ user: userId, punchOut: null });
    if (!attendance) {
      return res.status(400).json({ message: 'Not punched in' });
    }
    attendance.punchOut = new Date();
    await attendance.save();
    res.json({ message: 'Punched out successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getAttendance = async (req, res) => {
  try {
    // List all users currently punched in
    const records = await Attendance.find({ punchOut: null }).populate('user', 'username email');
    res.json(records.map(r => ({ username: r.user.username, email: r.user.email, punchIn: r.punchIn })));
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
}; 