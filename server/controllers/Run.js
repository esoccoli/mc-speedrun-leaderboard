// const { mongoose } = require('mongoose');
const models = require('../models');
const RunModel = require('../models/Run');

const { Run } = models;

/*
  Leaderboard page will show the leaderboard for the currently selected category
  It will have some sort of selector to switch between the 3 different categories
  It will use a dynamic react component to detect which category is selected and
  display the proper page content, including completion times
*/
const lbPage = async (req, res) => res.render('app');

const addRun = async (req, res) => {
  if (
    !req.body.timeHrs
    || !req.body.timeMins
    || !req.body.timeSecs
    || !req.body.timeMs
    || !req.body.category
    || !req.body.version
    || !req.body.difficulty
  ) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  const runData = {
    user: req.session.account.username,
    timeHrs: req.body.timeHrs,
    timeMins: req.body.timeMins,
    timeSecs: req.body.timeSecs,
    timeMs: req.body.timeMs,
    category: req.body.category,
    version: req.body.version,
    difficulty: req.body.difficulty,
    verified: req.body.verified,
  };

  try {
    const newRun = new Run(runData);
    await newRun.save();

    return res.status(201).json({
      user: newRun.user,
      timeHrs: newRun.timeHrs,
      timeMins: newRun.timeMins,
      timeSecs: newRun.timeSecs,
      timeMs: newRun.timeMs,
      category: newRun.category,
      version: newRun.version,
      difficulty: newRun.difficulty,
      verified: newRun.verified,
    });
  } catch (err) {
    console.log(err);

    // Currently dont care about duplicates, might change that later
    return res.status(500).json({ error: 'An error occured while saving completion info!' });
  }
};

// Gets all completions matching the specified request parameters
const getRuns = async (req, res) => {
  let query = {};

  // If the includeUnverified param is missing or set to false, default to not including them
  // Otherwise, include all results regardless of verification status

  // TODO: Change this to only retrieve the selected category
  if (!req.session.account.isAdmin) {
    query = { category: req.body.category, verified: false };
  } else {
    query = {};
  }

  try {
    const docs = (await Run.find(query).select('user timeHrs timeMins timeSecs timeMs category version difficulty verified').sort({
      timeHrs: 1, timeMins: 1, timeSecs: 1, timeMs: 1,
    }).exec());

    return res.json({ runs: docs });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Error retrieving completions!' });
  }
};

// Gets all of the completions submitted by the currently logged in user
const getPersonalRuns = async (req, res) => {
  const query = { user: req.session.account.user };

  try {
    const docs = await Run.find(query).select('user timeHrs timeMins timeSecs timeMs category version difficulty verified').exec();

    return res.json({ runs: docs });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Error retrieving completions!' });
  }
};

const getNumSubmissions = async (req, res) => {
  const numSubmissions = await RunModel.countDocuments();

  return res.status(200).json({ numSubmissions });
};

const getRecentRuns = async (req, res) => {
  const query = {};

  try {
    const docs = await Run.find(query).select('user timeHrs timeMins timeSecs timeMs category version difficulty verified createdDate').sort({ createdDate: -1 }).limit(1)
      .exec();
    console.log(docs);
    return res.json({ recentRuns: docs });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Error retreiving runs!' });
  }
};

module.exports = {
  lbPage,
  addRun,
  getRuns,
  getPersonalRuns,
  getNumSubmissions,
  getRecentRuns,
  // makeDomo,
  // deleteDomo,
  // getDomos,
};
