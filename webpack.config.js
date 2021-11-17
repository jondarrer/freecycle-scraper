/*eslint indent: ["error", 2, { "SwitchCase": 1 }]*/
let config;

switch (String.prototype.toLowerCase.apply(process.env.NODE_ENV || 'production')) {
  case 'production':
    config = require('./webpack.production.config');
    break;
  default:
    config = require('./webpack.development.config');
}

module.exports = config;