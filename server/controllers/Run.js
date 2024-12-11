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

// Gets the data about a run from the form and saves it to the database
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
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'An error occured while saving completion info!' });
  }
};

// Gets all completions matching the specified request parameters
const getRuns = async (req, res) => {
  const query = {};

  try {
    const docs = (await Run.find(query).select('user timeHrs timeMins timeSecs timeMs category version difficulty').sort({
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
    const docs = await Run.find(query).select('user timeHrs timeMins timeSecs timeMs category version difficulty').exec();

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

// Gets the most recently submitted
const getRecentRuns = async (req, res) => {
  const query = {};

  try {
    const docs = await Run.find(query).select('user timeHrs timeMins timeSecs timeMs category version difficulty createdDate').sort({ createdDate: -1 }).limit(1)
      .exec();
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
};
