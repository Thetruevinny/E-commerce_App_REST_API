const express = require('express');
const userRouter = express.Router();
const pool = require('../server/db');

userRouter.use('/:id', (req, res, next) => {
    req.userId = req.params.id;
    // Checking if Id value is a number.
    if (Number(req.userId) || Number(req.userId) === 0) {
        next();
    } else {
        res.status(400).send('You have entered an incorrect id format.');
    }
});

userRouter.get('/:id', async (req, res, next) => {
    // Obtain information on current logged in user
    try {
        const query = {
            text: 'SELECT * FROM users WHERE id=($1);',
            values: [Number(req.userId)]
        };
        const {rows} = await pool.query(query);
        res.status(200).send(rows[0]);
    } catch (err) {
        console.log(err);
    }
});

userRouter.put('/:id', async (req, res, next) => {
    // Update user information.
    const {username, password} = req.body;
    try {
        const query = {
            text: 'UPDATE users SET name=($1), password=($2) WHERE id=($3);',
            values: [username, password, req.userId]
        };
        const {rows} = await pool.query(query);
        res.status(201).send('User has been updated.');
    } catch (err) {
        console.log(err);
    }
});


module.exports = userRouter;