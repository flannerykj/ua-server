"use strict";

let db = require('./pghelper');
let escape = s => s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');


let findAllDummy = (req, res, next) => {

  let sql = "SELECT * FROM artists;";
  return db.query(sql, [])
    .then(result => {
      console.log(result);
      return(res.json({statusCode: 200, data: result}));
    })
    .catch((err)=>{res.json({ statusCode: 500, message: err }); return next});
}
let findAll = (req, res, next) => {
    console.log('findingall artists');
    let pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 12,
        page = req.query.page ? parseInt(req.query.page) : 1,
        search = req.query.search,
        min = req.query.min,
        max = req.query.max,
        whereParts = [],
        values = [];

    if (search) {
        values.push(escape(search));
        whereParts.push("artists.name ~* $" + values.length);
    }

    let where = whereParts.length > 0 ? ("WHERE " + whereParts.join(" AND ")) : "";

  let countSql = "SELECT COUNT(*) from artists " + where;
  let sql = "SELECT * " +
    "FROM artists  " + where +
    " ORDER BY artists.name LIMIT $" + (values.length + 1) +
    " OFFSET $" + + (values.length + 2);
  console.log('sql is: ', sql);
    db.query(countSql, values)
    .then(result => {
        console.log('RESULT: ', result);
            let total = parseInt(result[0].count);
            db.query(sql, values.concat([pageSize, ((page - 1) * pageSize)]))
                .then(items=> {
                  return res.json({
                    statusCode: 200,
                    data: {"pageSize": pageSize, "page": page, "total": total, "items": items}
                  })
                })
                .catch(next);
    })

        .catch(next);
};

let findById = (req, res, next) => {
  let id = req.params.id;
  let sql = "select *, ( select array(SELECT w.id FROM posts w WHERE w.artist_id = $1 ORDER BY w.date_posted DESC LIMIT 3 )) as posts from artists a WHERE a.id = $1 ;";

    db.query(sql, [id])
        .then(item => res.json({ statusCode: 200, data: item[0] }))
        .catch(next);
};


let updateById = (req, res, next) => {
  let id = req.params.id;
  let name = req.body.name.replace("'", "''");
  let bio = req.body.bio.replace("'", "''");
  let sql = "UPDATE artists SET name='" + name + "', bio=E'" + bio + "' WHERE id=" + id + " RETURNING id; "

  db.query(sql)
    .then(item => res.json({statusCode: 200, data: item[0]}))
    .catch(next)
}

let submitNew = (req, res, next) => {
  console.log(req.body);
  let name = req.body.name;
  let sql = "INSERT INTO artists (name) VALUES ('" + name + "') RETURNING artists.id;"

  db.query(sql)
    .then(item => res.json({ statusCode: 200, data: item[0]}))
    .catch(next);
}

exports.submitNew = submitNew;
exports.updateById = updateById;
exports.findById = findById;

exports.findAllDummy = findAllDummy;
exports.findAll = findAll;
