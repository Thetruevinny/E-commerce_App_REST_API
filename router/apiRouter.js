const express = require('express');
const apiRouter = express.Router();
const { checkUserName, passwordHash } = require('../server/users');
const pool = require('../server/db');
const productsRouter = require('./products');
const userRouter = require('./userRouter');
const ordersRouter = require('./orders');
const cartRouter = require('./cart');

// Registering user and adding to the user database.
apiRouter.post('/register', checkUserName , async (req, res, next) => {
    const { username, password } = req.body;
    // Check if username already exists
    if (req.exists) {
        res.status(400).send('User Already Exists');
    } else {
        try {
            // Add user to databse
            const {rows} = await pool.query('SELECT COUNT(*) FROM users;');
            const newId = rows[0].count;
            const hashPassword = await passwordHash(password);
            query = {
                text: 'INSERT INTO users(id, name, password) VALUES($1, $2, $3);',
                values: [newId, username, hashPassword]
            }
            await pool.query(query);
            res.status(201).redirect('/login');
        } catch (err) {
            console.log(err);
        }
    }
});
// Render Homepage
apiRouter.get('/', (req, res, next) => {
    res.render('home');
});

// Rendering user login page
apiRouter.get('/login', (req, res, next) => {
    res.render('login');
});

// Using different routers for different routes
apiRouter.use('/products', productsRouter);
apiRouter.use('/users', userRouter);
apiRouter.use('/orders', ordersRouter);
apiRouter.use('/cart', cartRouter);

module.exports = apiRouter;