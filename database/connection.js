const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  //user: 'jp_tcu_db_user',   
  host: 'localhost',
  //host: 'dpg-d3b0jkruibrs73f3gnag-a',   
  database: 'ae_bd',
  //database: 'jp_tcu_db_2k2q',
  password: '12345',
  //password: 'pgN4PHG0RBxH5lRLHHQ7RzMG0JgvVU5r',
  port: 5432
});

module.exports = pool;