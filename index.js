try {
  require('fs').accessSync(`${__dirname}/.git`);
  const production = process.env.NODE_ENV === 'production';
  module.exports = require('./lib-node6' + (production ? '' : '-dev') + '/');
} catch (err) {
  module.exports = require('./lib-node6/');
}
