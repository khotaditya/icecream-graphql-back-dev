const userResolver = require('./user');
const icecreamResolver = require('./icecream');
const orderResolver = require('./order');

const rootResolver = {
    ...userResolver,
    ...icecreamResolver,
    ...orderResolver
};

module.exports = rootResolver;