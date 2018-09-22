"use strict";
let utils = require('../services/location');
let db = require('./pghelper');
let fs = require('fs');
let moment = require('moment');

const uploadFiles = (req, res, next) => {
  var uploads = [];
  req.body.images.map((data, i) => {
    let base64Image = data.split(';base64,').pop();
    var filename = `${i}_${Date.now()}.JPG`;
    fs.writeFile(`./server/uploads/${filename}`, base64Image, {encoding: 'base64'}, function(err) {
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

const submitNew = (req, res, next) => {
  console.log('body: ', req.body);
  var artist_id = req.body.artistId||null;
  const new_artist_name = req.body.new_artist_name;
  if (artist_id==null||'null') {
    if(new_artist_name) {
      console.log('creating new artist ' + new_artist_name);
      var newArtistSql = "INSERT INTO artists (name) VALUES ($$" + new_artist_name + "$$) RETURNING artists.id;"
    } else {
      artist_id = 1;
    }
  }
  let image = req.body.image;
  let description = req.body.description;
  let user_id = req.body.userId;
  let place = req.body.place;
  let lng = place ? place.geometry.location.lng : 43.6;
  let lat = place ? place.geometry.location.lat : -79.3;
  let formatted_address = place ? place.formatted_address : null;
  let city = place ? place.city||utils.getAddressComponents(place).City.short_name : null;
  let place_id = place ? place.place_id : 0;
  let photo_date = moment().unix(req.body.photo_date);
  console.log(photo_date);

  let locationSql = "INSERT INTO locations (lng, lat, formatted_address, city, google_place_id) VALUES (" + lng + ", " + lat + ", $$" + formatted_address + "$$, $$" + city + "$$, '" + place_id + "') RETURNING id;";

  db.query(locationSql)
    .then((id) => {
      var sql = "INSERT INTO posts (id, description, artist_id, image,  date_posted, location_id, user_id) VALUES (DEFAULT, $$" + description + "$$, $1,  $$" + image + "$$, DEFAULT, " + id[0].id + ", '" + user_id + "') RETURNING posts.id;";
      console.log(sql);
      if(newArtistSql) {
        db.query(newArtistSql)
          .then((item) => {
            db.query(sql, [item[0].id])
              .then((item) => {
              return res.json({successful: true, data: item[0]});
            });
          });
      } else {
      db.query(sql, [artist_id])
          .then((item) => {
            return res.json({successful: true, data: item[0]});
        });
      }
    });
}


exports.submitNew = submitNew;
exports.uploadFiles = uploadFiles;
