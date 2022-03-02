const express = require('express');
const app = express();
const session = require('express-session');
const MySQLStore = require('express-mysql-session');
app.use(session({
    secret: '1351320sgs',
    resave: false,
    saveUninitialized: true,
    store: new MySQLStore({
        host: 'localhost',
        port: 3306,
        user: 'root',
        password: 'Xptmxm1212!@',
        database: 'o2'
    })
}));
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded( { extended: false } ));
const bkfd2Password = require('pbkdf2-password');
const hasher = bkfd2Password();
const mysql = require('mysql');
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Xptmxm1212!@',
    database: 'o2'
});
connection.connect();
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(function(user, done) {
    done(null, user.userid);
});
passport.deserializeUser(function(id, done) {
    connection.query(sql[0], id, (err, member) => {
        done(null, member[0]);
    });
});
passport.use(new LocalStrategy(
    function(username, password, done) {
        connection.query(sql[0], username, (err, member) => {
            if(err) {
                console.log(err);
                res.send('Internal Server Error');
            }
            else if(member.length == 0) {
                done(null, false);
            }
            else {
                hasher({ password: password, salt: member[0].salt }, (error, pw, salt, hash) => {
                    if(hash === member[0].password) {
                        done(null, member[0]);
                    }
                    else {
                        done(null, false);
                    }
                });
            }
        });
    }
));

const sql = ["select * from member where userid=?", "insert into member(userid, password, email, salt) values(?, ?, ?, ?)"];

app.get('/', (req, res) => {
    res.redirect('/welcome');
})

app.get('/auth/login', (req, res) => {
    res.send(`
        <h1>Login</h1>
        <form action="/auth/login" method="post">
            <p><input type="text" name="username" placeholder="username"></p>
            <p><input type="password" name="password" placeholde="password"></p>
            <p><input type="submit">
        </form>
        <p><a href="/auth/registration">registration</a></p>
    `);
});

// app.post('/auth/login', (req, res) => {
//     const username = req.body.username;
//     const password = req.body.password;
//     connection.query(sql[0], username, (err, member) => {
//         if(err) {
//             console.log(err);
//             res.send('Internal Server Error');
//         }
//         else if(member.length == 0) {
//             res.redirect('/welcome');
//         }
//         else {
//             hasher({ password: password, salt: member[0].salt }, (error, pw, salt, hash) => {
//                 if(hash === member[0].password) {
//                     req.session.username = username;
//                     req.session.save(() => {
//                         res.redirect('/welcome');
//                     })
//                 }
//                 else {
//                     res.send('<script type="text/javascript">alert("Check password");location.href="/auth/login";</script>');
//                 }
//             });
//         }
//     });
// });

app.post('/auth/login', passport.authenticate('local', { successRedirect: '/welcome', failureRedirect: '/welcome', failureFlash: false }));

app.get('/auth/registration', (req, res) => {
    res.send(`
        <h1>Registration<h1>
        <form action="/auth/registration" method="post">
            <p><input type="text" name="username" placeholder="username"></p>
            <P><input type="text" name="email" placeholder="email"></p>
            <p><input type="password" name="password" placeholde="password"></p>
            <p><input type="submit">
        </form>
    `);
});

app.post('/auth/registration', (req, res) => {
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    hasher({ password: password }, (err, pw, salt, hash) => {
        if(err) {
            console.log(err);
            return;
        }
        connection.query(sql[1], [username, hash, email, salt], (error) => {
            if(error) {
                console.log(error);
                return;
            }
            connection.query(sql[0], username, (err, member) => {
                req.login(member[0], function(err) {
                    req.session.save(function() {
                        res.redirect('/welcome');
                    })
                });
            });
        })
    });
})

app.get('/auth/logout', (req, res) => {
    req.logout();
    req.session.save(function() {
        res.redirect('/welcome');
    });
});

app.get('/welcome', (req, res) => {
    if(req.user) {
        res.send(`
            <h1>Hello, ${req.user.userid}!</h1>
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