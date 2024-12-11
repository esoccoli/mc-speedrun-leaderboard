const models = require('../models');

const { Account } = models;

// Displays the html page for login/signup/change password
const loginPage = (req, res) => res.render('login');

// Signs the user out of their account and deletes the session from redis
const logout = (req, res) => {
  req.session.destroy();
  res.redirect('/');
};

// Checks the login info in the form, validates it against existing accounts,
// and signs the user in, if the info is valid
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

// Gets account information from the form, validates it as needed,
// and then creates an account with that information in the database
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

// Checks the information in the form, validates it as necessary,
// and then updates the password for the specified user to the
// newly provided password (after hashing it)
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
    return res.json({ redirect: '/' });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'An error occured!' });
  }
};

// Gets a count of the number of accounts that exist in the database
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
