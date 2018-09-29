"use strict";

let express = require('express'),
  compression = require('compression'),
  bodyParser = require('body-parser'),
  expressValidator = require('express-validator'),
  session = require('express-session'),
  auth = require('./controllers/auth'),
  posts = require('./controllers/posts'),
  images = require('./controllers/images'),
  comments = require('./controllers/comments'),
  artists = require('./controllers/artists'),
  users = require('./controllers/users'),
  jwtauth = require('./controllers/jwtauth'),
  validation = require('./controllers/formValidation'),
  multer = require('multer'),
  formidable = require('formidable'),
  fs = require('fs'),
  path = require('path'),
  sanitize = require("sanitize-filename"),
  app = express();

app.set('port', 8080);

app.use(bodyParser.urlencoded({ extended: true, limit: 52428800}));
app.use(bodyParser.json({limit: '50MB'}));

//Express Session
app.use(
  session({
    secret: 'secret',
    saveUninitialized: true,
    resave: true
  }));

// Adding CORS support
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


require('./routers/index')(app);




//RUN ON PORT
//======================================
app.listen(app.get('port'), function () {
  console.log(process.env.NODE_ENV)
    console.log('Express server listening on port ' + app.get('port'));
});

