import Adafruit_CharLCD as LCD
from time import sleep
import functions
import os

# Retreive the I2C-address setting
settings = functions.Settings()
plugin_settings = settings.retreive()
plugin_settings = settings.validate(plugin_settings)
config_lcd_address = plugin_settings['config_lcd_address']['value']

# Raspberry Pi pin configuration:
lcd_rs        = 27  # Note this might need to be changed to 21 for older revision Pi's.
lcd_en        = 22
lcd_d4        = 25
lcd_d5        = 24
lcd_d6        = 23
lcd_d7        = 18
lcd_backlight = 4

# Define LCD column and row size for 16x2 LCD.
lcd_columns = 20
lcd_rows    = 4


# commands
LCD_CLEARDISPLAY = 0x01
LCD_RETURNHOME = 0x02
LCD_ENTRYMODESET = 0x04
LCD_DISPLAYCONTROL = 0x08
LCD_CURSORSHIFT = 0x10
LCD_FUNCTIONSET = 0x20
LCD_SETCGRAMADDR = 0x40
LCD_SETDDRAMADDR = 0x80

# flags for display entry mode
LCD_ENTRYRIGHT = 0x00
LCD_ENTRYLEFT = 0x02
LCD_ENTRYSHIFTINCREMENT = 0x01
LCD_ENTRYSHIFTDECREMENT = 0x00

# flags for display on/off control
LCD_DISPLAYON = 0x04
LCD_DISPLAYOFF = 0x00
LCD_CURSORON = 0x02
LCD_CURSOROFF = 0x00
LCD_BLINKON = 0x01
LCD_BLINKOFF = 0x00

# flags for display/cursor shift
LCD_DISPLAYMOVE = 0x08
LCD_CURSORMOVE = 0x00
LCD_MOVERIGHT = 0x04
LCD_MOVELEFT = 0x00

# flags for function set
LCD_8BITMODE = 0x10
LCD_4BITMODE = 0x00
LCD_2LINE = 0x08
LCD_1LINE = 0x00
LCD_5x10DOTS = 0x04
LCD_5x8DOTS = 0x00

# flags for backlight control
LCD_BACKLIGHT = 0x08
LCD_NOBACKLIGHT = 0x00

En = 0b00000100 # Enable bit
Rw = 0b00000010 # Read/Write bit
Rs = 0b00000001 # Register select bit

class lcd:
  """
  Class to control the 16x2 I2C LCD display from sainsmart from the Raspberry Pi
  """

  def __init__(self):
    """Setup the display, turn on backlight and text display + ...?"""
    # Initialize the LCD using the pins above.
    self.device = LCD.Adafruit_CharLCD(lcd_rs, lcd_en, lcd_d4, lcd_d5, lcd_d6, lcd_d7, lcd_columns, lcd_rows, lcd_backlight)
    sleep(0.2)

  def strobe(self, data):
    """clocks EN to latch command"""
    sleep(0.001)

#  def display_string(self, string, line):
  def display_string(self, string, line):
    """display a string on the given line of the display, 1 or 2, string is truncated to 20 chars and centred"""
    centered_string = string.center(20)
    if line == 1:
      self.device.set_cursor(1,0)
    if line == 2:
      self.device.set_cursor(1,1)
    if line == 3:
      self.device.set_cursor(1,2)
    if line == 4:
      self.device.set_cursor(1,3)
    for char in centered_string:
      self.device.write8(ord(char), True)

  def clear(self):
    """clear lcd and set to home"""
    self.device.clear()

  def backlight_off(self):
    """turn off backlight, anything that calls write turns it on again"""
    self.device.set_backlight(0)

  def display_off(self):
    """turn off the text display"""
    self.device.enable_display(False)

  def display_on(self):
    """turn on the text display"""
    self.device.enable_display(True)