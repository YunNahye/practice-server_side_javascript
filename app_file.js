const express = require('express');
const bodyParser = require('body-parser');
const fs =require('fs');
const app = express();

app.use(bodyParser.urlencoded({ extended: false}));

app.set('view engine', 'jade');
app.set('views', './views_file');

app.get(['/topic', '/topic/:topic'], (req, res) => {
  const topic = req.params.topic;
    fs.readdir('data', (err, files) => {
      if(err){
        console.log(err);
        res.status(500).send('Internal Server Error;');
      }
      else{
        if(topic){
          if(topic == 'new'){
            res.render('new', { topics: files });
          }
          else{
            fs.readFile('data/' + topic, 'utf-8', (err, data) => {
              if(err){
                res.status(500).send('Internal Server Error');
              }
              else{
                res.render('view', { topics: files, title: topic, description: data });
              }
            });
          }
        }
        else{
          res.render('view', { topics: files });
        }
      }
    });
});

app.post('/topic', (req, res) => {
  const title = req.body.title;
  const description = req.body.description;
  fs.writeFile('data/'+title, description, (err) => {
    if(err){
      res.status(500).send('Internal Server Error');
    }
    else{
      fs.readdir('data', (err, files) => {
        if(err){
          console.log(err);
          res.status(500).send('Internal Server Error;');
        }
        else{
          res.redirect('/topic/'+title);
        }
      });
    }
  })
});

app.listen(3000, () => console.log('Connected 3000 port!'));