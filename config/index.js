let config;

switch (String.prototype.toLowerCase.apply(process.env.NODE_ENV || 'dev')) {
  case 'production':
    config = require('./config.production');
    break;
  default:
    config = require('./config.dev');
}

module.exports = config;
