const express = require('express');
const cartRouter = express.Router();
const pool = require('../server/db');

cartRouter.use('/:productId', (req, res, next) => {
    req.productId = req.params.productId;
    if (!req.session.cart) {
        req.session.cart = [];
    }
    // Checking if Id value is a number.
    if (Number(req.productId) || Number(req.productId) === 0 || req.productId === 'checkout') {
        next();
    } else {
        res.status(400).send('You have entered an incorrect id format.');
    }
});

// Creating Cart for the user session
cartRouter.get('/', (req, res, next) => {
    res.status(201).render('cart');
});

cartRouter.post('/checkout', async (req, res, next) => {
    let total = 0;
    try {

        // Create new Order id
        const orders = await pool.query('SELECT COUNT(*) FROM orders;');
        const newOrderId = orders.rows[0].count;

        // Create order array for insert statement on orders_products
        const orderArray = [];

        // Create string array for insert statement on orders_products
        const stringArray = [];

        // Create string array for update statement on products
        const productsArray = [];

        // Pulling product information
        const {rows} = await pool.query('SELECT * FROM products');

        // Finding if product quantity in order greater than in stock
        req.session.cart.forEach(product => {
            const result = rows.find(invProduct => invProduct.id === product.id);
            if (!result) {
                req.session.cart = [];
                res.status(500).send(`We have removed product ${product.id} from our store.`);
            }
            if (product.quantity > result.quantity) {
                res.status(500).send(`We don't have product ${product.id} in stock.`)
            };
            total += result.price * product.quantity;
            orderArray.push(newOrderId, product.id, product.quantity);
            productsArray.push(`(${product.id}, ${product.quantity})`);
        });

        const newOrderQuery = {
            text: 'INSERT INTO orders(id, userid, total) VALUES ($1, $2, $3);',
            values: [newOrderId, req.user.id, total]
        }

        await pool.query(newOrderQuery);

        for (let i = 0; i < orderArray.length; i++) {
            if ((i + 1) % 3 === 0) {
                stringArray.push(`($${i-1}, $${i}, $${i+1})`);
            }
        };

        const orderString = stringArray.join(',');
        const productsString = productsArray.join(',');

        const orderQuery = {
            text: 'INSERT INTO orders_products(order_id, product_id, quantity) VALUES ' + orderString,
            values: orderArray
        };

        await pool.query(orderQuery);

        await pool.query(`UPDATE products AS p SET quantity = p.quantity - p2.quantity FROM (VALUES ${productsString}) AS p2(id, quantity) WHERE p2.id = p.id;`);

        res.status(201).send('Order saved and should be with you in a week.');

    } catch (err) {
        console.log(err);
    }

});

// Adding a product to the user cart
cartRouter.post('/:productId', async (req, res, next) => {
    // No need to check quantity as this value is not inputted by user
    // Obtain the quantity of the product added to cart
    let { productId, quantity } = req.body;
    quantity = Number(quantity);
    productId = Number(productId);

    // Check if the user has removed the product
    if (quantity === 0) {
        req.session.cart.filter(product => product.id != productId);
    }

    // Check to see if product already exists in the cart
    const result = req.session.cart.findIndex(product => product.id === productId);
    
    if (result != -1) {
        // Changing the quantity of the object in the cart
        req.session.cart[result].quantity = quantity;
    } else {
        
        req.session.cart.push({
            id: productId,
            quantity,
        });
    };
    // Explicitly save the session
    req.session.touch();
    req.session.save((err) => {
        if (err) {
            console.log('Error saving session:', err);
            return next(err);
        }
        res.status(201).redirect('/cart');
    });
});

module.exports = cartRouter;