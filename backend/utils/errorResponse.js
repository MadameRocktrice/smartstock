const sendServerError = (res, error) => {
  console.error(error);
  return res.status(500).json({ message: 'Interner Serverfehler' });
};

const sendClientError = (res, error, statusCode = 400) => {
  return res.status(statusCode).json({ message: error.message });
};

module.exports = { sendServerError, sendClientError };
