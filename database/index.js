const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'postgres',
  port: process.env.DB_PORT || '5432',
  database: process.env.DB_NAME || 'postgres',
  password: process.env.DB_PASSWORD || '',
  max: 100,
})

pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err)
  process.exit(-1)
})

pool.on('connect', client => {
  console.log(`pool connected to ${client.user}@${client.host} using database ${client.database} on port ${client.port}`)
})

module.exports = pool