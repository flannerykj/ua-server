
const morgan = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser');
const session = require('express-session');
const compression = require('compression');
const helmet = require('helmet');
const { RateLimitedError } = require('../utilities/errors');
const logger = require('./logger');
// const redis = require('redis');

/* const redisClient = redis.createClient(
  process.env.REDIS_PORT,
  process.env.REDIS_HOST, {
    auth_pass: process.env.REDIS_PASSWORD
  }
); */

// redisClient.select(1);

module.exports = {
  /* rateLimit: (app) => {
    if (!process.env.NODE_ENV.match(/test/)) {
      const limiter = require('express-limiter')(app, redisClient);
      limiter({
        path: '/api/reset-password',
        method: 'post',
        lookup: ['connection.remoteAddress'],
        total: 3,
        expire: 1000 * 60 * 60,
        onRateLimited(req, res, next) {
          next(new RateLimitedError());
        }
      });
      limiter({
        path: '/api/public/shared/:token',
        method: 'post',
        lookup: ['params.token', 'connection.remoteAddress'],
        total: 3,
        expire: 1000 * 60 * 60,
        onRateLimited(req, res, next) {
          next(new RateLimitedError());
        }
      });
    }
  }, */
  logRequests: (app) => {
    if (!process.env.NODE_ENV.match(/test/)) {
      const logFormat = process.env.NODE_ENV === 'production' ? 'combined' : 'dev';
      app.use(morgan(logFormat));
    }
  },

  useMiddleware: (app) => {
    app.use(helmet());
    app.use(helmet.noCache());
    app.use(bodyParser.urlencoded({ extended: true, limit: 52428800}));
    app.use(bodyParser.json({limit: '50MB'}));

    app.use(
      session({
        secret: 'secret',
        saveUninitialized: true,
        resave: true
      }));
    app.all('*', function (req, res, next) {
      // Set CORS headers: allow all origins, methods, and headers: you may want to lock this down in a production environment
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Methods", "GET, PUT, PATCH, POST, DELETE");
      res.header("Access-Control-Allow-Headers", req.header('access-control-request-headers'));

      if (req.method === 'OPTIONS') {
          // CORS Preflight
          res.send();
      } else {
          next();
      }
    });

    app.use(compression());
  },

  logErrors: (app) => {
    app.use((err, req, res, next) => {
      if (!process.env.NODE_ENV.match(/test/)) {
        console.log(err);
      }
      if (process.env.NODE_ENV !== 'development') {
        delete err.stack;
      }
      logger.error(err.message, req.path, req.params, req.query, req.ip);
      res.status(err.statusCode || 500).json({ error: err });
      next();
    });
  }
};
