import time
import network
from machine import Pin
from umqtt.simple import MQTTClient
import config

led = Pin(2, Pin.OUT)

def setup_mqtt():
  client = MQTTClient(client_id=config.DEVICE_ID, server=config.MQTT_BROKER, keepalive=10)
  client.set_last_will(config.TOPIC_STATUS, b"offline", retain=True, qos=1)
  return client

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

    led.on()

    return True
  else:
    print("Gagal menghubungkan ke Wifi")

    led.off()

    return False