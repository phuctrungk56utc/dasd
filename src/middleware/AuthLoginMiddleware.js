const jwt = require('jsonwebtoken')
const db = require("../db/db");
const crypt = require("../crypt/crypt");

const verifyToken = (req, res, next) => {
    const user = req.body.userId;
    const passWord = String(req.body.password);

    try {
        if (user !== '' && passWord !== '' ) {
            next();
        }else{
            return res.sendStatus(404).json({ error:'Username and password is not null' });
        }
    } catch (error) {
        // client.end()
        return res.sendStatus(404);
    }
}

module.exports = verifyToken
