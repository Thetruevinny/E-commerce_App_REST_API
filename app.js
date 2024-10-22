const express = require('express');
const app = express();
const apiRouter = require('./router/apiRouter');
const cors = require('cors');
const session = require('express-session');
const pool = require('./server/db');
const path = require('path');
require('dotenv').config({
    override: true,
    path: path.join(__dirname, './.env')
});
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const {comparePasswords} = require('./server/users');
const pgSession = require('connect-pg-simple')(session);

const port = 3000;
// const store = new session.MemoryStore();
const store = new pgSession({
    pool: pool,
    tablename: 'session'
});

// Setting up various middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(session({
    secret: process.env.SESSIONSECRET,
    cookie: {
        maxAge: (1000*60*60*12), 
        secure: false,
        sameSite: 'lax'
    },
    resave: false,
    saveUninitialized: false,
    store,
}));
app.use(passport.initialize());
app.use(passport.session());
// Set EJS as the view engine
app.set("view engine", "ejs");

// Set the views directory
app.set("views", path.join(__dirname, "views"));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const query = {
            text: 'SELECT * FROM users WHERE id=($1)',
            values: [id]
        };
        const {rows} = await pool.query(query);
        const user = rows[0];
        done(null, user);
    } catch (err) {
        done(err);
    };
});

// Authentication Strategy
passport.use(new LocalStrategy(async function (username, password, done) {
    try {
        const query = {
            text: 'SELECT * FROM users WHERE name= ($1);',
            values: [ username ]
        };
        const {rows}= await pool.query(query);
        const user = rows[0];
        const verified = await comparePasswords(password, user.password);
        if (!user) {
            return done(null, false);
        } else if (!verified) {
            return done(null, false);
        } else {
            return done(null, user);
        };  
    } catch (err) {
        return done(err);
    }
}));

// Creating passport authentication middleware
apiRouter.post('/login', passport.authenticate('local', {failureRedirect: '/login'}), (req,res) => {
    res.status(200).render('home');
});

// Adding apirouter to application
app.use(apiRouter);

app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
});