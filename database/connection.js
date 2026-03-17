const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  //user: 'ss',   
  host: 'localhost',
  //host: 'dpg-d6jijo6a2pns73f6gkvg-a',   
  database: 'ae_bd',
  //database: 'ae_bd',
  password: '12345',
  //password: 'byIOdcqpWJViWBZEs70PkNALaTO0hGIi',
  port: 5432
  //port: 5432
});

module.exports = pool;