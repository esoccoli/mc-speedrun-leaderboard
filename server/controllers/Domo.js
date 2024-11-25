// const { mongoose } = require('mongoose');
const models = require('../models');

const { Domo } = models;

const makerPage = async (req, res) => res.render('app');

const makeDomo = async (req, res) => {
  if (!req.body.name || !req.body.nickname || !req.body.age) {
    return res.status(400).json({ error: 'Name, nickname, and age are all required!' });
  }

  const domoData = {
    name: req.body.name,
    nickname: req.body.nickname,
    age: req.body.age,
    owner: req.session.account._id,
  };

  try {
    const newDomo = new Domo(domoData);
    await newDomo.save();
    return res.status(201).json({
      name: newDomo.name,
      nickname: newDomo.nickname,
      age: newDomo.age,
    });
  } catch (err) {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Domo already exists!' });
    }
    return res.status(500).json({ error: 'An error occured making domo!' });
  }
};

const deleteDomo = async (req, res) => {
  if (!req.body.name) {
    return res.status(400).json({ error: 'Name is required' });
  }

  try {
    const query = { name: req.body.name };
    Domo.findOneAndDelete(query).exec();
    return res.status(204).json({ message: 'Record(s) successfully deleted' });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'An error occured!' });
  }
};

const getDomos = async (req, res) => {
  try {
    const query = { owner: req.session.account._id };
    const docs = await Domo.find(query).select('name nickname age').lean().exec();

    return res.json({ domos: docs });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Error retrieving domos!' });
  }
};

module.exports = {
  makerPage,
  makeDomo,
  deleteDomo,
  getDomos,
};
