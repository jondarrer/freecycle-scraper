let { Session } = require('./index');
var TWO_DAYS = 2 * 24 * 60 * 60 * 1000;

var session = new Session();
session.refresh();

setInterval(session.refresh, TWO_DAYS);
