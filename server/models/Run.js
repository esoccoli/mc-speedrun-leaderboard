const mongoose = require('mongoose');
const _ = require('underscore');

const setTime = (time) => _.escape(time).trim();

const RunSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    required: true,
    trim: true,
    ref: 'Account',
  },
  time: {
    type: String,
    required: true,
    trim: true,
    set: setTime,
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
  verified: {
    type: Boolean,
    required: true,
    default: false,
  },
  createdDate: {
    type: Date,
    default: Date.now(),
  },
});

RunSchema.statics.toAPI = (doc) => ({
  time: doc.time,
  category: doc.category,
  version: doc.version,
  difficulty: doc.difficulty,
  verified: doc.verified,
});

const RunModel = mongoose.model('Run', RunSchema);
module.exports = RunModel;
