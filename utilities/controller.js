const { BadRequestError, ServerError, isCustomError } = require('./errors');

exports.handleError = (err, message) => {
  if (isCustomError(err)) {
    return err;
  }
  return new ServerError(message, err.stack);
};
