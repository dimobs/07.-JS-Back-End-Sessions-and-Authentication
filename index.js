const express = require('express'); //server
const cookieParser = require('cookie-parser'); //seion
const { v4: uuid } = require('uuid'); //random ID
const bcrypt = require('bcrypt'); //hesh pass
const jwt = require('./lib/jwt'); //token

const app = express(); 
const secret = 'alabalasecretstochadura';

app.use(cookieParser()); 
app.use(express.urlencoded({ extended: false })); //body Parser

const users = {};

app.get('/', (req, res) => {
    res.status(200).send('Hello')
});

app.get('/register', (req, res) => {
    res.send(`
        <form method="POST">
            <label for="username">Username</label>
            <input type="text" name="username" id="username">
            <label for="password">Password</label>
            <input type="password" name="password" id="password">
            <input type="submit" value="Register">
        </form>
    `);
});

app.post('/register', async (req, res) => {
    const { username, password } = req.body;

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    users[username] = {
        password: hash
    };

    res.redirect('/login');
});

app.get('/login', (req, res) => {
    res.send(`
        <form method="POST">
            <label for="username">Username</label>
            <input type="text" name="username" id="username">
            <label for="password">Password</label>
            <input type="password" name="password" id="password">
            <input type="submit" value="Login">
        </form>
    `);
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    const hash = users[username]?.password;
    const isValid = await bcrypt.compare(password, hash);

    if (isValid) {
        try {
            const payload = { username };
            const token = await jwt.sign(payload, secret, { expiresIn: '2d' });

            res.cookie('token', token);
            res.redirect('/profile');
        } catch (err) {
            console.log(err);
            res.redirect('/404');
        }
    } else {
        res.status(401).send('Unauthorized');
    }
});

app.get('/profile', async (req, res) => {
    const token = req.cookies['token']; //guard

    if (token) {
        try {
            const payload = await jwt.verify(token, secret) //guard

            res.send(`Profile: ${payload.username}`);
        } catch (err) {
            res.status(401).send('Unauthorized');
        }
    } else {
        res.redirect('/login');
    }
});

app.listen(5000, () => console.log('Serrver is listening on port 5000...'));
