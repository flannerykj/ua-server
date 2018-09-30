"use strict";

let express = require('express'),
  multer = require('multer'),
  fs = require('fs'),
  path = require('path'),
  sanitize = require("sanitize-filename"),
  app = express();

const {
  logRequests,
  logErrors,
  useMiddleware
} = require('./utilities/server');

logRequests(app);
useMiddleware(app);
/* const background = require('.//Background');
  if (background) {
    background.initialize();
  } */
app.set('port', 8080);



//Express Session

// Adding CORS support

require('./routers/index')(app);

//RUN ON PORT
//======================================
app.listen(app.get('port'), function () {
  console.log(process.env.NODE_ENV)
    console.log('Express server listening on port ' + app.get('port'));
});

