
const { check, validatiddonResult } = require('express-validator/check');

exports.works = [
  check('image', 'Must provide an image ').isLength({min: 5}),
]

