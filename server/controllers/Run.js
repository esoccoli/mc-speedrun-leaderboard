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
    !req.body.time
    || !req.body.category
    || !req.body.version
    || !req.body.difficulty
  ) {
    // console.log('checking all required params are present');
    // console.log(`time: ${req.body.time}`);
    // console.log(`category: ${req.body.category}`);
    // console.log(`version: ${req.body.version}`);
    // console.log(`difficulty: ${req.body.difficulty}`);
    // console.log(`verified: ${req.body.verified}`);
    return res.status(400).json({ error: 'All fields are required' });
  }
  const runData = {
    user: req.session.account.username,
    time: req.body.time,
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
      time: newRun.time,
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
// const makeDomo = async (req, res) => {
//   if (!req.body.name || !req.body.nickname || !req.body.age) {
//     return res.status(400).json({ error: 'Name, nickname, and age are all required!' });
//   }

//   const domoData = {
//     name: req.body.name,
//     nickname: req.body.nickname,
//     age: req.body.age,
//     owner: req.session.account._id,
//   };

//   try {
//     const newDomo = new Domo(domoData);
//     await newDomo.save();
//     return res.status(201).json({
//       name: newDomo.name,
//       nickname: newDomo.nickname,
//       age: newDomo.age,
//     });
//   } catch (err) {
//     console.log(err);
//     if (err.code === 11000) {
//       return res.status(400).json({ error: 'Domo already exists!' });
//     }
//     return res.status(500).json({ error: 'An error occured making domo!' });
//   }
// };

// const deleteDomo = async (req, res) => {
//   if (!req.body.name) {
//     return res.status(400).json({ error: 'Name is required' });
//   }

//   try {
//     const query = { name: req.body.name };
//     Domo.findOneAndDelete(query).exec();
//     return res.status(204).json({ message: 'Record(s) successfully deleted' });
//   } catch (err) {
//     console.log(err);
//     return res.status(500).json({ error: 'An error occured!' });
//   }
// };

// Retreives the list of Domos owned by the currently signed in user
// const getDomos = async (req, res) => {
//   try {
//     const query = { owner: req.session.account._id };
//     const docs = await Domo.find(query).select('name nickname age').lean().exec();

//     return res.json({ domos: docs });
//   } catch (err) {
//     console.log(err);
//     return res.status(500).json({ error: 'Error retrieving domos!' });
//   }
// };

// Gets all completions matching the specified request parameters
const getRuns = async (req, res) => {
  let query = {};

  // If the includeUnverified param is missing or set to false, default to not including them
  // Otherwise, include all results regardless of verification status

  // TODO: Change this to only retrieve the selected category
  if (!req.session.account.isAdmin) {
    query = { category: req.body.category, verified: true };
  } else {
    query = {};
  }

  try {
    const docs = await Run.find(query).select('user time category version difficulty verified').exec();

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
    const docs = await Run.find(query).select('user time category version difficulty verified').exec();

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

module.exports = {
  lbPage,
  addRun,
  getRuns,
  getPersonalRuns,
  getNumSubmissions,
  // makeDomo,
  // deleteDomo,
  // getDomos,
};
