"use strict";
let db = require('./pghelper');

let escape = s => s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
const { check, validationResult } = require('express-validator/check');

let findAll = (req, res, next) => {
  console.log('attempting to find all');
  let pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 8,
    page = req.query.page ? parseInt(req.query.page) : 1,
    search = req.query.search,
    min = req.query.min,
    max = req.query.max,
    artist_id = req.query.artist_id,
    whereParts = [],
    values = [];

  if (search) {
        values.push(escape(search));
        whereParts.push("posts.description || artists.name || locations.formatted_address ~* $" + values.length);
  }
  if (artist_id) {
    values.push(escape(artist_id));
    whereParts.push("artist_id = $1");
  }
  let where = whereParts.length > 0 ? ("WHERE " + whereParts.join(" AND ")) : "";
  console.log(whereParts);
  let countSql = "SELECT COUNT(*) FROM (((posts INNER JOIN artists ON posts.artist_id = artists.id) INNER JOIN locations ON posts.location_id = locations.id) INNER JOIN users ON posts.user_id = users.id) " + where;
  let sql = "SELECT posts.id, posts.image, date_posted, description, artist_id, artists.name as artist, locations.city as city, locations.formatted_address as formatted_address, locations.lng as lng, locations.lat as lat, user_id, users.username as username, applauseCount " +
    "FROM ((((posts INNER JOIN artists ON posts.artist_id = artists.id) INNER JOIN locations ON posts.location_id = locations.id) INNER JOIN users ON posts.user_id = users.id) LEFT OUTER JOIN (SELECT post_id, count(*) as applauseCount FROM applause as a1 GROUP BY a1.post_id) subquery ON posts.id = subquery.post_id) " + where +
    " ORDER BY posts.date_posted DESC LIMIT $" + (values.length + 1) + " OFFSET $" +  + (values.length + 2);

  db.query(countSql, values)
    .then(result => {
      let total = parseInt(result[0].count);
      db.query(sql, values.concat([pageSize, ((page - 1) * pageSize)]))
        .then(items => {
          return res.json({
            statusCode: 200,
            data: {"pageSize": pageSize, "page": page, "total": total, "results": items}
          });
        })
        .catch(next);
    })
    .catch(next);
  }

let findById = (req, res, next) => {
  let id = req.params.id;
  let sql = "SELECT posts.id, posts.image, date_posted, description, artist_id, artists.name as artist, locations.city as city, locations.formatted_address as formatted_address, locations.lng as lng, locations.lat as lat, user_id, users.username as username " +
    "FROM (((posts INNER JOIN artists ON posts.artist_id = artists.id) INNER JOIN locations ON posts.location_id = locations.id) INNER JOIN users ON posts.user_id = users.id) " +
    "WHERE posts.id = $1";

  db.query(sql, [id])
    .then(item => res.json(item[0]))
    .catch(next);
};

let deletePost = (req, res, next) => {
  let id = req.params.id;
  let sql = "DELETE FROM posts WHERE posts.id = $1";
  db.query(sql, [id])
    .then(item => res.json({successful: true}))
    .catch(next);
}

let applaudPost = (req, res, next) => {
  let post_id = req.params.id;
  let user_id = req.body.user_id;
  console.log('applauding post ', post_id);

  let applaudSql = "INSERT INTO applause (post_id, user_id) VALUES (" + post_id + ", " + user_id + ");";
  console.log(applaudSql);

  db.query(applaudSql)
    .then(id => res.json({successful: true, applause: true}))
    .catch((error) => { //if user has already applauded the post, remove their applause.
      let removeSql = "DELETE FROM applause WHERE post_id = " + post_id + " AND  user_id = " + user_id + ";";
      db.query(removeSql)
        .then(result => res.json({successful: true, applause: false}))
        .catch((error) => res.json({successful: false}));
    });
}

exports.deletePost = deletePost;
exports.findAll = findAll;
exports.findById = findById;
exports.applaudPost = applaudPost;
