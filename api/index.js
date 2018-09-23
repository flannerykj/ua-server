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

//Express Validator
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
    var namespace = param.split('.')
    , root = namespace.shift()
      , formParam = root;
    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param: formParam,
      msg: msg,
      value: value
    };
  }
}));

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

app.get('/api', (req, res) => {
  res.send("Welcome to the Urban Applause API");
})

//OTHER API ROUTES...
//===============================
app.post('/api/register', auth.register);
app.post('/api/login', auth.login);

app.get('/api/posts', posts.findAll);
app.get('/api/posts/:id', posts.findById);
app.post('/api/posts/:id/applaud', posts.applaudPost);
app.post('/api/posts', [jwtauth], posts.submitNew);
app.delete('/api/posts/:id', [jwtauth], posts.deletePost);

app.post("/api/upload", images.uploadFiles);
app.get("/api/uploads/:filename",  images.getFile);

app.get('/api/comments/:post_id', comments.findByPostId);
app.post('/api/comments', [jwtauth], comments.submitNew);
app.delete('/api/comments/:id', [jwtauth], comments.deleteComment);

app.get('/api/artists', artists.findAll);
app.get('/api/artists/:id', artists.findById);
app.post('/api/artists', [jwtauth], artists.submitNew);
app.put('/api/artists/:id', [jwtauth], artists.updateById);

app.get('/api/users', users.findAll);
app.get('/api/users/:id', users.findById);
app.post('/api/users', users.submitNew);
app.put('/api/users/:id', [jwtauth], users.updateById);



//RUN ON PORT
//======================================
app.listen(app.get('port'), function () {
  console.log(process.env.NODE_ENV)
    console.log('Express server listening on port ' + app.get('port'));
});

