const pool = require('./db.js');
const bcrypt = require('bcrypt');
const path = require('path');
require('dotenv').config({
    override: true,
    path: path.join(__dirname, '../.env')
});

const checkUserName = async (req, res, next) => {
    const {username, password} = req.body; 
    try {
        const query = {
            text: 'SELECT name FROM users WHERE name= ($1);',
            values: [ username ]
        };
        const {rows} = await pool.query(query);
        const user = rows[0];
        if (user) {
            req.exists = true;
            req.user = user.name;
            req.password = password;
        } else {
            req.exists = false;
        }
        next();
    } catch (err) {
        console.log(err);
    }
};

const passwordHash = async (password) => {

    const salt = await bcrypt.genSalt(Number(process.env.SALTROUNDS));

    const hashedPassword = await bcrypt.hash(password, salt);

    return hashedPassword;
};

const comparePasswords = async (password, hash) => {

    try {
        const matches = await bcrypt.compare(password, hash);
        return matches;
    } catch (err) {
        console.log(err);
    }

    return false;
}

module.exports = {
    checkUserName,
    passwordHash,
    comparePasswords
};