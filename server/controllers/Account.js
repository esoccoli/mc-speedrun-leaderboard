const models = require('../models');

const { Account } = models;

const loginPage = (req, res) => res.render('login');

const logout = (req, res) => {
  req.session.destroy();
  res.redirect('/');
};

const login = (req, res) => {
  const username = `${req.body.username}`;
  const pass = `${req.body.pass}`;

  if (!username || !pass) {
    return res.status(400).json({ error: 'All fields are required!' });
  }

  return Account.authenticate(username, pass, (err, account) => {
    if (err || !account) {
      return res.status(401).json({ error: 'Wrong username or password!' });
    }

    req.session.account = Account.toAPI(account);
    return res.json({ redirect: '/leaderboard' });
  });
};

const signup = async (req, res) => {
  const username = `${req.body.username}`;
  const pass = `${req.body.pass}`;
  const pass2 = `${req.body.pass2}`;
  const isAdmin = `${req.body.isAdmin}`;

  if (!username || !pass || !pass2 || !isAdmin) {
    return res.status(400).json({ error: 'All fields are required!' });
  }

  if (pass !== pass2) {
    return res.status(400).json({ error: 'Passwords do not match!' });
  }

  try {
    const hash = await Account.generateHash(pass);
    const newAccount = new Account({ username, password: hash, isAdmin });
    await newAccount.save();
    req.session.account = Account.toAPI(newAccount);

    return res.json({ redirect: '/leaderboard' });
  } catch (err) {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Username already in use!' });
    }
    return res.status(500).json({ error: 'An error occured!' });
  }
};

const changePass = async (req, res) => {
  const username = `${req.body.username}`;
  const newPass = `${req.body.pass}`;
  const newPass2 = `${req.body.pass2}`;

  if (!username || !newPass || !newPass2) {
    return res.status(400).json({ error: 'All fields are required!' });
  }

  if (newPass !== newPass2) {
    return res.status(400).json({ error: 'Passwords do not match!' });
  }

  try {
    const hash = await Account.generateHash(newPass);

    const filter = { username };
    const update = { password: hash };

    const account = await Account.findOneAndUpdate(filter, update);
    console.log(account);
    // console.log(updatedAccount.password);
    // const newAccount = new Account({ username, password: hash });
    return res.json({ redirect: '/' });
  } catch (err) {
    console.log(err);
    // if (err.code === 11000) {
    //   return res.status(400).json({ error: 'Username already in use!' });
    // }
    return res.status(500).json({ error: 'An error occured!' });
  }
};

const getNumUsers = async (req, res) => {
  const numUsers = await Account.countDocuments();
  return res.status(200).json({ numUsers });
};

module.exports = {
  loginPage,
  login,
  logout,
  signup,
  changePass,
  getNumUsers,
};
