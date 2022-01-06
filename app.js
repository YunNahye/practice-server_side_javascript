const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.listen(3000, () => console.log('Connected 3000 port!'));

app.set('view engine', 'jade');
app.set('views', './views');

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false}));

app.get('/', (req, res) => {
	res.send('Welcome to home page!');
});

app.get('/topic/:id', (req, res) => {
  const topics = [
    'Javascript is...',
    'Nodejs is...',
    'Express is...'
  ];
  const output = `
    <a href="/topic?id=0">Javascript</a><br>
    <a href="/topic?id=1">Nodejs</a><br>
    <a href="/topic?id=2">Express</a><br><br>
    ${topics[req.params.id]}
  `;
  res.send(output);
});

app.get('/template', (req, res) => {
  res.render('temp');
});

app.get('/form', (req, res) => {
  res.render('form');
});

app.get('/form_receiver', (req, res) => {
  const title = req.query.title;
  const description = req.query.description;
  res.send(title + ',' + description);
});

app.post('/form_receiver', (req, res) => {
  const title = req.body.title;
  const description = req.body.description;
  res.send(title + ',' + description);
})

app.get('/login', (req, res) => {
	res.send('Please login');
});

app.get('/home', (req, res) => {
	res.send('<h1>Real home page!!</h1>');
});

app.get('/route', (req, res) => {
	res.send('Hello router! <img src="/capture.png">');
});

app.get('/dynamic', (req, res) => {
	lis = '';
	for (i=0;i<5;i++){
		lis = lis + '<li>coding</li>';
	}
	const time = Date();
	const output = `<!DOCTYPE html>
	<html>
	  <head>
	    <meta charset="utf-8">
	    <title></title>
	  </head>
	  <body>
	    <h1>Hello dynamic!</h1>
	    <ul>
		${lis}
	    </ul>
	    <h2>${time}</h2>
	  </body>
	</html>
	`;
	res.send(output);
});