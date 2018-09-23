"use strict";

const productionConfigs = {
  user: 'flannerykj',
  host: 'localhost',
  database: 'urbanapplause',
  password: 'cheesecake',
  port: 5432,
  ssl: true,
  idleTimeoutMillis: 1000, // close idle clients after 1 second
  connectionTimeoutMillis: 1000, // return an error after 1 second if connection could not be established,
  max: 10
}

const devConfigs = {
  url: 'postgres://flannerykj:cheesecake@postgres:5432/ua_development',
  user: 'flannerykj',
  host: 'postgres',
  database: 'ua_development',
  password: 'cheesecake',
  port: 5432,
  logUnclosedConnections: true,
  idleTimeoutMillis: 1000, // close idle clients after 1 second
  connectionTimeoutMillis: 1000, // return an error after 1 second if connection could not be established
  max: 10
}

 const { Pool, Client } = require('pg')


exports.query = function (sql, values, singleItem, dontLog) {
  console.log(process.env.NODE_ENV);
  const pool = new Pool(process.env.NODE_ENV=="development" ? devConfigs : productionConfigs);
  if (!dontLog) {
    //console.log(sql, values);
  }
  return new Promise((resolve, reject) => {
    pool.connect(function(err, client, done) {
      if (err) {
        done();
        console.log(err);
        reject(err);
      }
      pool.query(sql, values, function (err, result) {
        if (err) {
          done();
          reject(err);
        } else {
          done();
          resolve(singleItem ? result.rows[0] : result.rows);
        }
      });
    });
  });
};
