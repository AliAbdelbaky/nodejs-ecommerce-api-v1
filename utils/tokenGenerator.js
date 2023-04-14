const JWT = require('jsonwebtoken');

const generateToken = (id) => {
    const token = JWT.sign({ userId: id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE_TIME
    })
    return token
}
module.exports = generateToken