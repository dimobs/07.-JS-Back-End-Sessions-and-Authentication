const util = require('util'); //asynk
const jwt = require('jsonwebtoken'); //token

const jwtPromises = {
    sign: util.promisify(jwt.sign),
    verify: util.promisify(jwt.verify),
};

module.exports = jwtPromises;
