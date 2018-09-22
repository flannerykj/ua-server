var jwt = require('jwt-simple');
let db = require('./pghelper');

module.exports = function(err, req, res, next) {
  console.log('TOKEN:', req.body.token);
  var token = (req.body && req.body.access_token) || (req.query && req.query.access_token) || req.headers['x-access-token'] || req.body.token;

  if (token) {
    try {
      var decoded = jwt.decode(token, 'jwtTokenSecret');
      if (decoded.exp <= Date.now()) {
        res.end('Access token has expired', 400);
      }
      let sql = "SELECT * FROM users WHERE id = " + decoded.iss + ";";
      db.query(sql)
        .then(result => {
          return next();
        });
    } catch (err) {
    }
  } else {

    res.json({status: 'failure', msg: err});
  }
};
