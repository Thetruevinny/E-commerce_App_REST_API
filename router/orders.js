const express = require('express');
const ordersRouter = express.Router();
const pool = require('../server/db');

ordersRouter.get('/', async (req, res) => {
    try {
        const query = {
            text: 'SELECT * FROM orders WHERE userid= ($1);',
            values: [ req.user.id ]
        };
        const {rows} = await pool.query(query);
        res.status(200).send(rows);
    } catch (err) {
        console.log(err);
    }
});

ordersRouter.get('/:id', async (req, res) => {
    const orderId = req.params.id;

    try {
        const query = {
            text: 'SELECT * FROM orders WHERE userid= ($1) AND id= ($2);',
            values: [ req.user.id, orderId ]
        };
        const {rows} = await pool.query(query);
        res.status(200).send(rows);
    } catch (err) {
        console.log(err);
    }
});

module.exports = ordersRouter;