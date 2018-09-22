"use strict";
let db = require('./pghelper');
let escape = s => s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');


let findByPostId = (req, res, next) => {
  let post_id = req.params.post_id,
  whereParts = [],
  values = [];

  console.log('finding comments for post of id ', post_id);
  if (post_id) {
    values.push(escape(post_id));
    whereParts.push("post_id = $1");
  }

  let where = whereParts.length > 0 ? ("WHERE " + whereParts.join(" AND ")) : "";

  let countSql = "SELECT COUNT(*) from comments INNER JOIN posts on comments.post_id = posts.id " + where;

  let sql = "SELECT comments.id, comments.date_posted, comments.text, posts.id as post_id, comments.user_id, users.username as username " +
    "FROM ((comments INNER JOIN posts ON comments.post_id = posts.id) INNER JOIN users ON comments.user_id = users.id) " + where +
    " ORDER BY comments.date_posted;";

  db.query(countSql, values)
    .then(result => {
      let total = parseInt(result[0].count);
      db.query(sql, values)
        .then(items => {
          console.log(items)
          return res.json({"total": total, "items": items});
        })
        .catch(next);
    })
    .catch(next);
  }



const submitNew = (req, res, next) => {
  console.log(req.body);
  var user_id = req.body.user_id;
  let text = req.body.text;
  let post_id= req.body.post_id;
  let date_posted = req.body.date_posted;

  var sql = "INSERT INTO comments (user_id, post_id, text, date_posted) VALUES (" + user_id + ", " + post_id + ", " + "'" + text + "', DEFAULT) RETURNING comments.id;";

  db.query(sql)
    .then((id) => {
      return res.json({successful: true, data: id});
    })
}

let deleteComment = (req, res, next) => {
  let id = req.params.id;
  let sql = "DELETE FROM comments WHERE comments.id = $1";
  db.query(sql, [id])
    .then(item => res.json({successful: true}))
    .catch(next);
}

exports.deleteComment = deleteComment;
exports.submitNew = submitNew;
exports.findByPostId = findByPostId;
