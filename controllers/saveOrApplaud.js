"use strict";
let db = require('./pghelper');
let escape = s => s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');

let applaudWork = (req, res, next) => {
  let work_id = req.body.work_id;
  let user_id = req.body.user_id;

  let applaudSql = "INSERT INTO applause (work_id, user_id) VALUES (" + work_id + ", " + user_id + ") RETURNING id;";

  db.query(applaudSql)
    .then((id) => res.json({sucessful: true}))
    .catch((error) => res.json({sucessful: false}));
}

let getApplauseCount(req, res, next) => {
  let work_id = req.body.work_id;
  let applauseSql = "SELECT COUNT(*) FROM works WHERE work.id= " + work_id + ";";

  db.query(countSql)
    .then((result) => res.json({sucessful: true}))
    .catch((error) => res.json({sucessful: false, error: error}));
}





