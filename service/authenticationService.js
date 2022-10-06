const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const token = req.headers["authorization"];
    if (!token) {
        return res.status(403).send('A token is required for authentication');  // forbidden
    }
    try {
        req.claims = jwt.verify(token, "secret");
    } catch (err) {
        return res.status(401).send('Invalid Token');  // unauthorized
    }
    return next();
}

module.exports = verifyToken;