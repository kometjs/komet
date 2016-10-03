var production = !process.env.DEBUG;
return module.exports = require('./lib-node6' + (production ? '' : '-dev') + '/');
