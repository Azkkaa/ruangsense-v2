import time
import network
from machine import Pin

# LED bawaan ESP32
led = Pin(2, Pin.OUT)

def connect_wifi(ssid, password):
  wlan = network.WLAN(network.STA_IF)
  wlan.active(True)

  if not wlan.isconnected():
    print("Connecting to wifi...")
    wlan.connect(ssid, password)

    timeout = 10
    while not wlan.isconnected() and timeout > 0:
      time.sleep(1)
      timeout -= 1
  
  if wlan.isconnected():
    print("Wifi terhubung!")
    print('Alamat IP ESP32:', wlan.ifconfig()[0])

    # Nyalakan LED bawaan
    led.on()

    return True
  else:
    print("Gagal menghubungkan ke Wifi")

    # Matikan LED jika gagal
    led.off()

    return False