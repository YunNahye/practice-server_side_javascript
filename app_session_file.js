const express = require('express');
const app = express();
const session = require('express-session');
const FileStore = require('session-file-store')(session);
app.use(session({
    secret: '460845613fag',
    resave: false,
    saveUninitialized: true,
    store: new FileStore()
}));
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

const sql = ["select * from member where userid=?"];

app.get('/', (req, res) => {
    res.redirect('/auth/login');
});

app.get('/auth/login', (req, res) => {
    res.send(`
        <h1>Login</h1>
        <form action="/auth/login" method="post">
            <p><input type="text" name="username" placeholder="username"></p>
            <p><input type="password" name="password" placeholde="password"></p>
            <p><input type="submit">
        </form>
    `);
});

app.post('/auth/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    connection.query(sql[0], username, (err, member) => {
        if(err) {
            console.log(err);
            res.send('Internal Server Error');
        }
        else if(member.length == 0) {
            res.redirect('/welcome');
        }
        else {
            if(password == member[0].password) {
                req.session.username = username;
                return req.session.save(function(){
                    res.redirect('/welcome');
                });
            }
            else {
                res.send('<script type="text/javascript">alert("Check password");location.href="/auth/login";</script>');
            }
        }
    });
});

app.get('/auth/logout', (req, res) => {
    delete req.session.username;
    return req.session.save(function(){
        res.redirect('/welcome');
    });
});

app.get('/welcome', (req, res) => {
    if(req.session.username) {
        res.send(`
            <h1>Hello, ${req.session.username}!</h1>
            <p><a href="/auth/logout">logout</a></p>
        `);
    }
    else {
        res.send(`
            <h1>Who are you??</h1>
            <p><a href="/auth/login">login</a></p>
        `);
    }
})

app.listen(3000, () => {
    console.log('Connected 3000 port!!!');
});