const mongoose = require('mongoose');
const _ = require('underscore');

const setTime = (time) => _.escape(time).trim();

const CompletionSchema = new mongoose.Schema({
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
    RSG = Random Seed Glitchless
    SSG = Set Seed Glitchless
    AA = All Advancements
  */
  category: {
    type: String,
    enum: ['RSG', 'SSG', 'AA'],
    required: true,
    trim: true,
  },
  private: {
    type: Boolean,
    required: true,
    default: false,
  },
  createdDate: {
    type: Date,
    default: Date.now(),
  },
});

CompletionSchema.statics.toAPI = (doc) => ({
  time: doc.time,
  category: doc.category,
  private: doc.private,
});

const CompletionModel = mongoose.model('Completion', CompletionSchema);
module.exports = CompletionModel;
