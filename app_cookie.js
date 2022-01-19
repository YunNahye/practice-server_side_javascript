const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded( { extended: false } ));
const cookieParser = require('cookie-parser');
app.use(cookieParser('slgawkegbsjdfn'));
app.set('view engine', 'jade');
app.set('views', './views_cookie');
const mysql = require('mysql')
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Xptmxm1212!@',
  database: 'o2'
});
connection.connect();

const sql = ['SELECT id, title FROM topic', 'SELECT title FROM topic WHERE id IN (?)'];

app.get('/', (req, res) => {
  res.redirect('/products');
})

app.get('/count', (req, res) => {
  if(req.signedCookies.count) {
    var count = parseInt(req.signedCookies.count);
  }
  else {
    var count = 0;
  }
  count = count + 1;
  res.cookie('count', count, {signed:true});
  res.send('count: ' + req.signedCookies.count);
})

app.listen(3000, () => {
  console.log('Connected 3000 port!!!');
});

app.get('/products', (req, res) => {
  connection.query(sql[0], (err, topics) => {
    if(err) {
      console.log(err);
      res.status(500).send('Internal Server Error');
    }
    else {
      res.render('products', { topics: topics });
    }
  });
});

app.get('/cart', (req, res) => {
  if(req.cookies.cart) {
    const cart = req.cookies.cart;
    const cartList = [];
    Object.keys(cart).forEach((product) => {
      cartList.push(parseInt(product));
    })
    connection.query(sql[1], [cartList], (err, products) => {
      if(err) {
        console.log(err);
        res.status(500).send('Internal Server Error');
      }
      else {
        res.render('cart', { products: products, count: Object.values(cart) });
      }
    });
  }
  else {
    res.send('empty');
  }
});

app.get('/cart/:id', (req, res) => {
  const id = req.params.id;
  if(req.cookies.cart) {
    var cart = req.cookies.cart;
  }
  else {
    var cart = {};
  }
  if(cart[`${id}`]) {
    cart[`${id}`] = cart[`${id}`] + 1;
  }
  else {
    cart[`${id}`] = 1;
  }
  res.cookie('cart', cart);
  const cartList = [];
  Object.keys(cart).forEach((product) => {
    cartList.push(parseInt(product));
  })
  connection.query(sql[1], [cartList], (err, products) => {
    if(err) {
      console.log(err);
      res.status(500).send('Internal Server Error');
    }
    else {
      res.render('cart', { products: products, count: Object.values(cart) });
    }
  });
})