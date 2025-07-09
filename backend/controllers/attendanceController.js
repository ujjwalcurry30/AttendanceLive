const Attendance = require('../models/Attendance');

exports.punchIn = async (req, res) => {
  try {
    const userId = req.user.userId;
    // Remove any stuck punch-in records (self-healing)
    await Attendance.updateMany({ user: userId, punchOut: null }, { $set: { punchOut: new Date() } });
    // Create a new punch-in record
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
    const records = await Attendance.find({ punchOut: null }).populate('user', 'username email');
    res.json(
      records
        .filter(r => r.user)
        .map(r => ({
          username: r.user.username,
          email: r.user.email,
          punchIn: r.punchIn
        }))
    );
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Late Arrivals: punchIn after 9:00 AM
exports.getLateArrivals = async (req, res) => {
  try {
    const { date } = req.query;
    const targetDate = date ? new Date(date) : new Date();
    targetDate.setHours(0, 0, 0, 0);
    const nextDate = new Date(targetDate);
    nextDate.setDate(targetDate.getDate() + 1);
    const lateTime = new Date(targetDate);
    lateTime.setHours(9, 0, 0, 0); // 9:00 AM

    const records = await Attendance.find({
      punchIn: { $gt: lateTime, $lt: nextDate }, // strictly after 9:00 AM
      punchOut: { $ne: null },
    }).populate('user', 'username email');

    res.json(records.map(r => ({
      username: r.user.username,
      email: r.user.email,
      punchIn: r.punchIn,
      punchOut: r.punchOut
    })));
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Early Leaves: punchOut before 6:00 PM
exports.getEarlyLeaves = async (req, res) => {
  try {
    const { date } = req.query;
    const targetDate = date ? new Date(date) : new Date();
    targetDate.setHours(0, 0, 0, 0);
    const nextDate = new Date(targetDate);
    nextDate.setDate(targetDate.getDate() + 1);
    const earlyTime = new Date(targetDate);
    earlyTime.setHours(18, 0, 0, 0); // 6:00 PM

    const records = await Attendance.find({
      punchOut: { $lt: earlyTime, $gte: targetDate }, // strictly before 6:00 PM
      punchIn: { $gte: targetDate, $lt: nextDate },
    }).populate('user', 'username email');

    res.json(records.map(r => ({
      username: r.user.username,
      email: r.user.email,
      punchIn: r.punchIn,
      punchOut: r.punchOut
    })));
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
}; 