const express = require('express');
const app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));

const mysql = require('mysql');
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'ydd1223',
  database: 'o2'
});
connection.connect();

app.set('view engine', 'jade');
app.set('views', './views_mysql');

const sql = ['SELECT id, title FROM topic', 'SELECT title, description FROM topic WHERE id=?', 'INSERT INTO topic (title, description , author) VALUES (?, ?, "root")', 'UPDATE topic SET title=?, description=? WHERE id=?', 'DELETE FROM topic WHERE id=?'];

app.get(['/topic', '/topic/:topic'], (req, res) => {
  const topic = req.params.topic;
  connection.query(sql[0], (err, topics, fields) => {
    if (err) {
      console.log(err);
      res.status(500).send('Internal Server Error');
    }
    else {
      if(topic) {
        if(topic == 'new') {
          res.render('new', { topics: topics });
        }
        else {
          connection.query(sql[1], topic, (err, data) => {
            res.render('view', { topics: topics, data: data, topic: topic });
          })
        }
      }
      else {
        res.render('view', { topics: topics });
      }
    }
  });
});

app.get(['/topic/:topic/edit'], (req, res) => {
  const topic = req.params.topic;
  connection.query(sql[0], (err, topics, fields) => {
    if (err) {
      console.log(err);
      res.status(500).send('Internal Server Error');
    }
    else {
      connection.query(sql[1], topic, (err, data) => {
        if (err) {
          console.log(err);
          res.status(500).send('Internal Server Error');
        }
        else {
          res.render('edit', { topics: topics, data: data, topic: topic });
        }
      });
    }
  });
});

app.post('/topic', (req, res) => {
  const newData = [req.body.title, req.body.description];
  connection.query(sql[2], newData, (err, rows) => {
    if (err) {
      console.log(err);
      res.status(500).send('Internal Server Error');
    }
    else {
      connection.query(sql[0], (err, topics) => {
        if (err) {
          console.log(err);
          res.status(500).send('Internal Server Error');
        }
        else {
          res.render('view', { topics: topics });
        }
      });
    }
  });
});

app.post('/topic/:topic/edit', (req, res) => {
  const newData = [req.body.title, req.body.description, req.params.topic];
  connection.query(sql[3], newData, (err, rows) => {
    if (err) {
      console.log(err);
      res.status(500).send('Internal Server Error');
    }
    else {
      connection.query(sql[0], (err, topics) => {
        if (err) {
          console.log(err);
          res.status(500).send('Internal Server Error');
        }
        else {
          res.render('view', { topics: topics });
        }
      });
    }
  });
});

app.post('/topic/:topic/edit', (req, res) => {
  const newData = [req.body.title, req.body.description, req.params.topic];
  connection.query(sql[3], newData, (err, rows) => {
    if (err) {
      console.log(err);
      res.status(500).send('Internal Server Error');
    }
    else {
      connection.query(sql[0], (err, topics) => {
        if (err) {
          console.log(err);
          res.status(500).send('Internal Server Error');
        }
        else {
          res.render('view', { topics: topics });
        }
      });
    }
  });
});

  // fs.writeFile('data/'+title, description, (err) => {
  //   if(err){
  //     res.status(500).send('Internal Server Error');
  //   }
  //   else{
  //     fs.readdir('data', (err, files) => {
  //       if(err){
  //         console.log(err);
  //         res.status(500).send('Internal Server Error;');
  //       }
  //       else{
  //         res.redirect('/topic/'+title);
  //       }
  //     });
  //   }
  // });

app.listen(3000, () => console.log('Connected 3000 port!'));