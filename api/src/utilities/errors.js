class CustomError extends Error {}

class RequestError extends CustomError {
  constructor(message, stack) {
    super(...arguments); // eslint-disable-line
    this.stack = stack || this.stack;
  }
}

class ValidationError extends CustomError {
  constructor(errors, message) {
    super(...arguments); // eslint-disable-line
    this.message = message || 'Invalid fields';
    this.statusCode = 400;
    this.errorCode = 400;
    this.fields = errors;
  }
}

class NotFoundError extends RequestError {
  constructor(message, stack, code) {
    super();
    this.stack = stack || this.stack;
    this.statusCode = 404;
    this.errorCode = code || 404;
    this.message = message || 'The requested resource could not be found';
  }
}

class AccessDeniedError extends RequestError {
  constructor(message, stack, code) {
    super();
    this.stack = stack || this.stack;
    this.statusCode = 401;
    this.errorCode = code || 401;
    this.message = `DH_ACCESS_DENIED: ${message}` || 'DH_ACCESS_DENIED';
  }
}

class ForbiddenError extends RequestError {
  constructor(message, stack, code) {
    super();
    this.stack = stack || this.stack;
    this.statusCode = 403;
    this.errorCode = code || 403;
    this.message = message || 'Forbidden';
  }
}

class BadRequestError extends RequestError {
  constructor(message, stack, code) {
    super();
    this.stack = stack || this.stack;
    this.statusCode = 400;
    this.errorCode = code || 400;
    this.message = message || 'Bad Request';
  }
}

class ServerError extends RequestError {
  constructor(message, stack, code) {
    super();
    this.stack = stack || this.stack;
    this.statusCode = 500;
    this.errorCode = code || 500;
    this.message = message || 'Something went wrong';
  }
}

class RateLimitedError extends RequestError {
  constructor(message, stack, code) {
    super();
    this.stack = stack || this.stack;
    this.statusCode = 429;
    this.errorCode = code || 429;
    this.message = message || 'Too many attempts from this IP. Please try again later';
  }
}

const customErrors = {
  RequestError,
  NotFoundError,
  AccessDeniedError,
  ServerError,
  BadRequestError,
  RateLimitedError,
  ForbiddenError,
  ValidationError
};

module.exports = {
  ...customErrors,
  isCustomError: (err) => err instanceof CustomError
};
