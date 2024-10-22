const express = require('express');
const productsRouter = express.Router({mergeParams: true});
const pool = require('../server/db');

productsRouter.use('/:id', (req, res, next) => {
    req.productId = req.params.id;
    // Checking if Id value is a number.
    if (Number(req.productId) || Number(req.productId) === 0) {
        next();
    } else {
        res.status(400).send('You have entered an incorrect id format.');
    }
});

productsRouter.get('/', async (req, res, next) => {
    // Category is selected from a dropdown so does not need to be verified.
    const category = req.query.category;
    
    // Check if query  parameter is used
    if (category) {
        try {
            const query = {
                text: 'SELECT (name, quantity, price) FROM products WHERE category= ($1);',
                values: [category]
            };
            const {rows} = await pool.query(query);
            console.log(rows[0]);
            res.status(200).send(rows);
        } catch (err) {
            console.log(err);
        }
    } else {
        try {
            const {rows} = await pool.query('SELECT * FROM products;');
            res.status(200).send(rows);
        } catch (err) {
            console.log(err);
        };
    }
});

productsRouter.get('/:id', async (req, res, next) => {
    try {
        const query = {
            text: 'SELECT * FROM products WHERE id= ($1);',
            values: [req.productId]
        };
        const {rows} = await pool.query(query);
        const result = rows[0];
        res.status(200).send(result);
    } catch (err) {
        console.log(err);
    }
});



module.exports = productsRouter;