const mysql = require('mysql');
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'ydd1223',
  database: 'o2'
});
connection.connect();

const sql = 'SELECT title FROM topic';
// connection.query(sql, (err, rows, fields) => {
//   if (err) console.log(err);
//   else {
//     for (let i=0; i<rows.length; i++) {
//       console.log(rows[i].description);
//     }
//   }
// });
const params = [4];
connection.query(sql, (err, rows, fields) => {
  if (err) console.log(err);
  else {
    console.log(rows);
    console.log(rows[title]);
  }
})
connection.end();