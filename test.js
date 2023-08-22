'use strict'

// const mysql = require('./index');

// const connection = mysql.createConnection({
//   host: '127.0.0.1',
//   port: 3306,
//   user: 'root',
// });
// connection.connect(err => {
//   if (err) {
//     console.log(err);
//     throw err
//   }
//   connection.query('show databases;', (err, rows) => {
//     if (err) {
//       throw err
//     }
//     console.log(rows);
//     connection.end()
//   });
// });

async function main () {
  const mysql = require('./promise');
  // const connection = await mysql.createConnection({
  //   host: 'gateway01.ap-southeast-1.prod.aws.tidbcloud.com',
  //   port: 4000,
  //   user: '3jcKHoz21PP4FTf.root',
  //   password: 'HOtrYRU7KcBFIiPJ',
  //   database: 'test',
  //   ssl: {
  //     minVersion: 'TLSv1.2',
  //     rejectUnauthorized: true
  //   }
  // });
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
