let { Worker } = require('./index');

var worker = new Worker();
worker.start();

setInterval(worker.start, 600000);