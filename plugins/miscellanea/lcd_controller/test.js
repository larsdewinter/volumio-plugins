'use strict';

const Lcd = require('lcd');
const lcdController = new Lcd({rs: 7, e: 8, data: [25, 24, 23, 18], cols: 20, rows: 4});

lcdController.on('ready', _ => {
    console.log("ready");
  setInterval(_ => {
    lcdController.setCursor(0, 0);
    lcdController.print(new Date().toISOString().substring(11, 19), err => {
      if (err) {
        console.log(err);
      }
    });
  }, 1000);
});

// If ctrl+c is hit, free resources and exit.
process.on('SIGINT', _ => {
  lcdController.close();
  process.exit();
});