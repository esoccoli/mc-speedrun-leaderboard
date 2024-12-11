const mongoose = require('mongoose');

const RunSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.String,
    required: true,
    trim: true,
    ref: 'Account',
  },
  timeHrs: {
    type: Number,
    required: true,
  },
  timeMins: {
    type: Number,
    required: true,
  },
  timeSecs: {
    type: Number,
    required: true,
  },
  timeMs: {
    type: Number,
    required: true,
  },
  /*
    Any% = Any Percent (just beat the game)
    RSG = Random Seed Glitchless
    SSG = Set Seed Glitchless
    AA = All Advancements
  */
  category: {
    type: String,
    enum: ['Any% RSG', 'Any% SSG', 'AA RSG', 'AA SSG'],
    required: true,
  },
  version: {
    type: String,
    enum: ['Pre 1.8', '1.8', '1.9-1.12', '1.13-1.15', '1.16+'],
    required: true,
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Normal', 'Hard', 'Hardcore', 'Peaceful'],
    required: true,
  },
  createdDate: {
    type: Date,
    default: Date.now(),
  },
});

RunSchema.statics.toAPI = (doc) => ({
  user: doc.user,
  timeHrs: doc.timeHrs,
  timeMins: doc.timeMins,
  timeSecs: doc.timeSecs,
  timeMs: doc.timeMs,
  category: doc.category,
  version: doc.version,
  difficulty: doc.difficulty,
  createdDate: doc.createdDate,
});

const RunModel = mongoose.model('Run', RunSchema);
module.exports = RunModel;
