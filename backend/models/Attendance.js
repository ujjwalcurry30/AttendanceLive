const mongoose = require('mongoose');

const AttendanceSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  punchIn: { type: Date, default: Date.now },
  punchOut: { type: Date },
});

module.exports = mongoose.model('Attendance', AttendanceSchema); 