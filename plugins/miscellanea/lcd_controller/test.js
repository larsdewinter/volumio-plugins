'use strict';

// This example demonstrates how to call print twice in succession to display
// two strings at different positions on the LCD.

const Lcd = require('lcd');
const lcd = new Lcd({rs: 26, e: 24, data: [22, 18, 16, 12], cols: 20, rows: 4});


lcd.on('ready', _ => {
  lcd.setCursor(0, 0);
  lcd.print('Hello!', err => {
    if (err) {
      throw err;
    }

    lcd.setCursor(0, 1);
    lcd.print('How are you?', err => {
      if (err) {
        throw err;
      }

      lcd.close();
    });
  });
});
