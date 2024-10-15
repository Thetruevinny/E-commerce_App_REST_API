const express = require('express');
const app = express();
const pool = require('./server/db');

const port = 3000;

// async function getUser() {
//     try {
//     const query = {
//         text: 'SELECT table_name FROM information_schema.tables WHERE table_type=$1',
//         values: ['BASE TABLE']
//     };
//     const {rows} = await pool.query(query);
//     const currentUser = rows;
//     console.log(currentUser);
//     } catch (err) {
//         console.log(err);
//     }
// }

// getUser();

// app.post('/register', (req, res, next) => {
//     const { username, password } = req.body;
//     // Check if username already exists

// });

app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
});