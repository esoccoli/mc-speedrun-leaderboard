const helper = require('./helper.js');
const React = require('react');
const { createRoot } = require('react-dom/client');
const { Form, Label, Input } = require('reactstrap');

// Captures and validates user entered account info, signs them in if everything is valid
const handleLogin = (e) => {
  e.preventDefault();
  helper.hideError();

  const username = e.target.querySelector('#user').value;
  const pass = e.target.querySelector('#pass').value;

  if (!username || !pass) {
    helper.handleError('Username or password is empty!');
    return false;
  }

  helper.sendPost(e.target.action, { username, pass });
  return false;
};

// Captures and validates user entered account info, & creates account if everything is valid
const handleSignup = (e) => {
  e.preventDefault();
  helper.hideError();

  const username = e.target.querySelector('#user').value;
  const pass = e.target.querySelector('#pass').value;
  const pass2 = e.target.querySelector('#pass2').value;

  if (!username || !pass || !pass2) {
    helper.handleError('All fields are required');
    return false;
  }

  if (pass !== pass2) {
    helper.handleError('Passwords do not match');
    return false;
  }

  helper.sendPost(e.target.action, { username, pass, pass2 });
  return false;
};

// Displays the login screen and prompts user to enter their account info
const LoginWindow = (props) => {
  return (
    <Form id="loginForm"
      name="loginForm"
      onSubmit={handleLogin}
      action="/login"
      method="POST"
      className="mainForm">
      <Label htmlFor="username">Username: </Label>
      <Input id="user" type="text" name="username" placeholder="username" />
      <Label htmlFor="pass">Password: </Label>
      <Input id="pass" type="password" name="pass" placeholder="password" />
      <Input className="formSubmit" type="submit" value="Sign in" />
    </Form>
  );
};

// Displays the signup screen and prompts user to enter account info
const SignupWindow = (props) => {
  return (
    <form id="signupForm"
      name="signupForm"
      onSubmit={handleSignup}
      action="/signup"
      method="POST"
      className="mainForm">
      <label htmlFor="username">Username: </label>
      <input id="user" type="text" name="username" placeholder="username" />
      <label htmlFor="pass">Password: </label>
      <input id="pass" type="password" name="pass" placeholder="password" />
      <label htmlFor="pass">Password: </label>
      <input id="pass2" type="password" name="pass2" placeholder="retype password" />
      <input className="formSubmit" type="submit" value="Sign in" />
    </form>
  );
};

const init = () => {
  const loginButton = document.getElementById('loginButton');
  const signupButton = document.getElementById('signupButton');

  const root = createRoot(document.getElementById('content'));

  loginButton.addEventListener('click', (e) => {
    e.preventDefault();
    root.render(<LoginWindow />);
    return false;
  });

  signupButton.addEventListener('click', (e) => {
    e.preventDefault();
    root.render(<SignupWindow />);
    return false;
  });

  root.render(<LoginWindow />);
};

window.onload = init;
