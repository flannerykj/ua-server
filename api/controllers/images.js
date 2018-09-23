"use strict";
let utils = require('../services/location');
let db = require('./pghelper');
let fs = require('fs');
let moment = require('moment');

const uploadFiles = (req, res, next) => {
  var uploads = [];
  req.body.images.map((data, i) => {
    let base64Image = data.split(';base64,').pop();
    var filename = `${i}_${Date.now()}.PNG`;
    console.log(process.cwd());
    fs.writeFile(`./uploads/${filename}`, base64Image, {encoding: 'base64'}, function(err) {
      if (err) {
        console.log('ERROR: ', err);
      } else {
        console.log('File created');
      }
    });
    uploads.push(filename);

  });
  console.log(uploads);
  res.json({statusCode: 200, data: uploads});

}

const getFile = (req, res, next) => {
  try {
    let filename = req.params.filename;
    console.log('get file: ', filename);
    console.log(process.cwd());
    var img = fs.readFileSync(`./uploads/${filename}`);
    res.writeHead(200, {'Content-Type': 'image/gif' });
    res.end(img, 'binary');
  } catch (error) {
    console.log(error);
    res.json({ statusCode: 404 });
  }
}

exports.uploadFiles = uploadFiles;
exports.getFile = getFile;
