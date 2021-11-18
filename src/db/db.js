const { Pool, Client } = require('pg')
// const pools = new Pool({
//   user: 'postgres',
//   host: 'localhost',
//   database: 'PRM_SYSTEM',
//   password: '@@@@',
//   port: 5433,
// })
const client = new Client({
	user: 'postgres',
	host: 'localhost',
	database: 'PRM_SYSTEM',
	password: '@@@@',//Ciber@2021
	port: 5433,
  })
client.connect()
module.exports = client;