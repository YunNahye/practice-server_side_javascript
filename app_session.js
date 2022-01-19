const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded( { extended: false } ));
app.set('view engine', 'jade');
app.set('views', './views_session');
const mysql = require('mysql')
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Xptmxm1212!@',
  database: 'o2'
});
connection.connect();

app.listen(3000, () => {
    console.log('Connected 3000 port!!!');
});