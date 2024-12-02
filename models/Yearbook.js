const mongoose = require('mongoose');

const yearbookSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: false },
  status: { type: String, enum: ['published', 'pending'], default: 'pending' },
  views: { type: Number, default: 0 },
  lastViewed: { type: Date, default: Date.now },
  thumbnail: { type: String, required: false },
  toReview: { type: Boolean, default: false },
  consentDeadline: { type: Date }
});

module.exports = mongoose.model('Yearbook', yearbookSchema);
