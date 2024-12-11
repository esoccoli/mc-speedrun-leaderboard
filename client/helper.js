const handleError = (message) => {
  document.getElementById('errorMessage').textContent = message;
  document.getElementById('message').classList.remove('hidden');
};

// Sends a post request to a specified url
// and calls the passed function once a response is received
const sendPost = async (url, data, handler) => {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();
  document.getElementById('message').classList.add('hidden');

  if (result.redirect) {
    window.location = result.redirect;
  }

  if (result.error) {
    handleError(result.error);
  }

  if (handler) {
    handler(result);
  }
};

// Hides error messages
const hideError = () => {
  document.getElementById('message').classList.add('hidden');
};

module.exports = {
  handleError,
  sendPost,
  hideError,
};
