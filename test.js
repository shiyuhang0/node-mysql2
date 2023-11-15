'use strict'

async function main () {
  const mysql = require('./promise');

  const connection = await mysql.createConnection({
    host: '127.0.0.1',
    port: 3306,
    user: 'root',
    database: 'mysql',
  });


  const [rows, fields] = await connection.execute('show databases');
  console.log(fields);
  console.log(rows);
  await connection.end()
  return rows
}

main().then(value => {
  console.log(value)
})
