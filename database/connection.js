const { Pool } = require('pg');

const pool = new Pool({
  //user: 'postgres',
  user: 'ss',   
  //host: 'localhost',
  host: 'dpg-d6vdtpa4d50c73funep0-a',   
  //database: 'ae_bd',
  database: 'ae_bd_2bjz',
  //password: '12345',
  password: 'R9J51LF5alwrlwwjPN5oD03grD1VXhB8',
  //port: 5432
  port: 5432
});

module.exports = pool;