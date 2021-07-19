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
lcd_backlight = 15

# Define LCD column and row size for 16x2 LCD.
lcd_columns = 20
lcd_rows    = 4

class lcd:
  """
  Class to control the 16x2 I2C LCD display from sainsmart from the Raspberry Pi
  """

  def __init__(self):
    """Setup the display, turn on backlight and text display + ...?"""
    # Initialize the LCD using the pins above.
    self.device = LCD.Adafruit_CharLCD(lcd_rs, lcd_en, lcd_d4, lcd_d5, lcd_d6, lcd_d7, lcd_columns, lcd_rows, lcd_backlight, 0, False)
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