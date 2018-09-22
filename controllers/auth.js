"use strict";
var bcrypt = require('bcrypt-nodejs');
var jwt = require('jwt-simple');
var moment = require('moment');
let db = require('./pghelper');
const { check, validationResult } = require('express-validator/check');


let login = (req, res, next) => {
  var email = req.body.email;
  var password = req.body.password;

  check('email', 'email-required').not().isEmpty();
  check('password', 'password-required').not().isEmpty();

  var error = validationResult(req);
  if (!error.isEmpty()) {
    console.log('is empty');
    return res.json({statusCode: 422, message: JSON.stringify(error.array()) })
  } else {
  let sql = "SELECT id, email, hash_pass, bio, date_created from users where email = '" + email + "';";
    db.query(sql)
      .then((result) => {
        if (result.length ==0) {
          console.log('no matches');
        res.json({statusCode: 500, messsage: 'Incorrect email or password', data: {}})
        return;
      }
        bcrypt.compare(password, result[0].hash_pass, function(err, resp){
          console.log('bycrypting');
          if (resp==true) {
            console.log('resp = true');
          var expires = new Date(moment().add('days', 7).valueOf()).toISOString();

          var token = jwt.encode({
            iss: result[0].id,
            exp: expires
          }, 'jwtTokenSecret');
          console.log('expires: ', expires);
          res.json({
            statusCode:  200,
            data: {
              token : token,
              expires,
              user: result[0]
            },
            message: ''
          });
          } else {
            console.log('invalid creds');
          res.json({
            statusCode: 500,
            message: 'Invalid credentials',
            data: {}
          });
        }
      });
    });
  }
}



let register = (req, res, next) => {
  var { email, password, password2 } = req.body;

  check('email').isEmail();
  check('email').not().isEmpty();
  check('password2').equals(password);

  var error = validationResult(req);

  if(!error.isEmpty()) {
    console.log('empty');
    return res.status(422).json({ message: error.array() })
  } else {
    var salt = bcrypt.genSaltSync(10);
    bcrypt.hash(password, salt, null, function(err, hash){
      console.log('bycrypting');
      let sql = "INSERT INTO users (email, hash_pass) VALUES ('" + email + "', '" + hash + "') returning users.id, users.email;";
      db.query(sql)
        .then((result) => {
          var expires = moment().add('days', 7).valueOf();
          var token = jwt.encode({
            iss: result[0].id,
            exp: expires
          }, 'jwtTokenSecret');
          console.log('success: ', );
          res.json({
            statusCode: 200,
            data: {
              token : token,
              expires: expires,
              user: {id: result[0].id, email: result[0].email}
              }
          });
        })
        .catch((error) => {
          console.log('error: ', error);
          var error = [];
          if (error.constraint=='unique_email') {
            error.push({param: "email", msg: "duplicate-email", value: ""});
          }
          res.json({statusCode: 500, message: error});
        });
    });
  }
}



exports.register = register;
exports.login = login;


