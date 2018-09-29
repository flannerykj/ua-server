"use strict";

let db = require('./pghelper');

let escape = s => s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
let createSql = (req, res, next) => {

let sql = `CREATE TABLE users (
  id serial PRIMARY KEY,
  bio VARCHAR (1000),
  hash_pass VARCHAR(500),
  location_id integer REFERENCES location (id),
  date_joined timestamp with time zone NOT NULL DEFAULT now(),
  image text
);`
  db.query(sql)
        .then(item => res.json(item))
        .catch(next);
}
let findAll = (req, res, next) => {
    let pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 12,
        page = req.query.page ? parseInt(req.query.page) : 1,
        search = req.query.search,
        min = req.query.min,
        max = req.query.max,
        whereParts = [],
        values = [];

    if (search) {
        values.push(escape(search));
        whereParts.push("user.username ~* $" + values.length);
    }

    let where = whereParts.length > 0 ? ("WHERE " + whereParts.join(" AND ")) : "";

  let countSql = "SELECT COUNT(*) from user " + where;
  let sql = "SELECT * " +
                "FROM users  " + where +
" LIMIT $" + (values.length + 1) + " OFFSET $" + + (values.length + 2);

    db.query(countSql, values)
        .then(result => {
            let total = parseInt(result[0].count);
            db.query(sql, values.concat([pageSize, ((page - 1) * pageSize)]))
                .then(items=> {
                    return res.json({"pageSize": pageSize, "page": page, "total": total, "items": items});
                })
                .catch(next);
        })
        .catch(next);
};

let findById = (req, res, next) => {
  let id = req.params.id;
  let sql = "select *, ( select array(SELECT w.id FROM works w WHERE w.user_id = $1 ORDER BY w.date_posted DESC LIMIT 3 )) as works from users u WHERE u.id = $1 ;";

    db.query(sql, [id])
        .then(item => res.json(item[0]))
        .catch(next);
};


let updateById = (req, res, next) => {
  let id = req.params.id;
  let bio = req.body.bio;
  let username = req.body.username;
  let sql = "UPDATE users SET bio='" + bio + "', username='" + username + "' WHERE id='" + id + "' RETURNING id; "

  db.query(sql)
    .then((error) => console.log(error));
}

let submitNew = (req, res, next) => {

  let id = req.body.id;
  let email = req.body.email;
  let username = req.body.username;
  let sql = "INSERT INTO users (id, email, username) VALUES ('" + id + "', '" + email + "', '" + username + "') ON CONFLICT DO NOTHING;";
 console.log(sql);
  db.query(sql)
    .then(item => res.json())
    .catch(next);
}
exports.createSql = createSql;
exports.submitNew = submitNew;
exports.updateById = updateById;
exports.findById = findById;
exports.findAll = findAll;
