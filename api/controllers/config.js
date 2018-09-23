const { Client } = require('pg')

const client = new Client({
  user: 'flannerykj',
  host: 'localhost',
  database: 'ua_development',
  password: 'cheesecake',
  port: 5432
})

client.connect()

module.exports = {
  client
};
