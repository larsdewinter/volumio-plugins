'use strict';

const Lcd = require('lcd');
const lcd = new Lcd({rs: 26, e: 24, data: [22, 18, 16, 12], cols: 20, rows: 4});

lcd.on('ready', _ => {
  setInterval(_ => {
    lcd.setCursor(0, 0);
    lcd.print(new Date().toISOString().substring(11, 19), err => {
      if (err) {
        throw err;
      }
    });
  }, 1000);
});

// If ctrl+c is hit, free resources and exit.
process.on('SIGINT', _ => {
  lcd.close();
  process.exit();
});