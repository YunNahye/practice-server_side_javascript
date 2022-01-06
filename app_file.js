const express = require('express');
const bodyParser = require('body-parser');
const fs =require('fs');
const app = express();

app.use(bodyParser.urlencoded({ extended: false}));

app.set('view engine', 'jade');
app.set('views', './views_file');

app.post('/topic', (req, res) => {
  res.send(`
    <h1>Server Side JavaScript</h1>
    <ul>
      <li><a href='/topic/express'>Express</a></li>
      <li><a href='/topic/javascript'>Javascript</a></li>
      <li><a href='/topic/nodejs'>Nodejs</a></li>
    </ul>
    <a href='/topic/new'>new</a>
  `)
});

// app.get('/topic/:name', (req, res) => {
//   res.send(`
//     <h1>Server Side Javascript</h1>
//     <ul>
//       <li><a href='/topic/express'>Express</a></li>
//       <li><a href='/topic/javascript'>Javascript</a></li>
//       <li><a href='/topic/nodejs'>Nodejs</a></li>
//     </ul>
//     <a href='/topic/new'>new</a>
//   `)
// });

app.get('/topic/new', (req, res) => {
  res.render('new');
});

app.listen(3000, () => console.log('Connected 3000 port!'));