const httpLib = require('http');

const routes = require('./routes');

module.exports = httpLib.createServer(routes);