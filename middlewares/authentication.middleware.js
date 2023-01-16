require('dotenv').config();
const jwt = require('jsonwebtoken');

const authenticate = (req,res, next) => {
    const token = req.headers.authorization;
    if (token) {
        const decode = jwt.verify(token, process.env.secretKey);
        if (decode) {
            next();
        } else {
            res.send('Please login first');
        }
    } else {
        res.send('Please login first');
    }
}

module.exports = {
    authenticate
};