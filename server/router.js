const controllers = require('./controllers');
const mid = require('./middleware');

const router = (app) => {
  app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);

  app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);

  app.post('/changePass', mid.requiresSecure, mid.requiresLogout, controllers.Account.changePass);

  app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);

  app.get('/logout', mid.requiresLogin, controllers.Account.logout);

  app.get('/getRuns', mid.requiresLogin, controllers.Run.getRuns);
  app.get('/getPersonalRuns', mid.requiresLogin, controllers.Run.getPersonalRuns);

  app.get('/getRecentRuns', mid.requiresLogin, controllers.Run.getRecentRuns);

  app.get('/leaderboard', mid.requiresLogin, controllers.Run.lbPage);
  app.post('/addRun', mid.requiresLogin, controllers.Run.addRun);

  app.get('/getNumUsers', mid.requiresLogin, controllers.Account.getNumUsers);
  app.get('/getNumSubmissions', mid.requiresLogin, controllers.Run.getNumSubmissions);

  // Redirects requests sent to any route other than the ones about back to '/'
  app.get('*', (req, res) => res.redirect('/'));
};

module.exports = router;
