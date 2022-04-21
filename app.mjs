import 'dotenv/config';
import express from 'express';
import morgan from 'morgan';
import expressSession from 'express-session';
import connectRedis from 'connect-redis';
import redisClient from './setup/redis.mjs';
import LoginRouter from './controllers/login.mjs';
import RegisterRouter  from './controllers/register.mjs'
import PasswordRouter from './controllers/password.mjs'
import SubmitRouter from './controllers/submit.mjs'

const app = express();
const RedisStore = connectRedis(expressSession);
app.use(morgan('dev'));
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(
    expressSession({
        secret: process.env.SESSION_STORE_KEY,
        resave: false,
        saveUninitialized: false,
        cookie: {
            secure: false, // if true only transmit cookie over https
            httpOnly: false, // if true prevent client side JS from reading the cookie
            maxAge: 1000 * 60 * 10 // session max age in miliseconds
        },
        store: new RedisStore({ client: redisClient })
    })
);

app.get('/', (req, res) => {
    res.render('home');
});
app.use('/login',LoginRouter);
app.use('/register',RegisterRouter);
app.use('/passwords', PasswordRouter);
app.use('/submit',SubmitRouter);
app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/login');
});
app.listen(3000, console.log('server running'));
