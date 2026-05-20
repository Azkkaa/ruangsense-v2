from machine import Pin, ADC, I2C
from machine_i2c_lcd import I2cLcd
from boot import connect_wifi
from boot import setup_mqtt
import asyncio
import dht
import math
import config
import ujson
import machine

device_id = config.DEVICE_ID

client = None

payload = {
    "device_id": device_id,
    "temp": 0,
    "humid": 0,
    "gas": 0
}

def setup_sensor():
  dht_pin = 15
  mq2_pin = 34

  dhtSensor = dht.DHT22(Pin(dht_pin))
  mq2Sensor = ADC(Pin(mq2_pin))
  mq2Sensor.atten(ADC.ATTN_11DB)

  class Sensor:
    def __init__(self, dhtSensor, mq2Sensor):
      self.dhtSensor = dhtSensor
      self.mq2Sensor = mq2Sensor

  if dhtSensor and mq2Sensor:
    return Sensor(dhtSensor=dhtSensor, mq2Sensor=mq2Sensor)
  else:
    return False

async def read_sensor ():
  sensor = setup_sensor()

  if not sensor:
    print("Failed to connect sensor. check the connection!!")
    return

  while True:
    try:
      sensor.dhtSensor.measure()
      raw_val = sensor.mq2Sensor.read()

      payload['temp'] = round(sensor.dhtSensor.temperature(), 2)
      payload['humid'] = round(sensor.dhtSensor.humidity(), 2)
      payload['gas'] = round(count_ppm(raw_adc=raw_val))

      print(f"[DHT] Temperature: {payload['temp']}°C, Humidity: {payload['humid']}%")
      print(f"[MQ-2] Consentration: {payload['gas']} ppm")
    except Exception as e:
      print(f"Failed to read full sensor!! Error:{e}")
    await asyncio.sleep(2)

def setup_lcd():
  print("Initializing LCD...")
  i2c = I2C(0, scl=Pin(22), sda=Pin(21), freq=400000)
  devices = i2c.scan()
  if len(devices) == 0:
    print("No I2C devices found. Check connections.")
    return None

  i2c_addr = devices[0]
  return I2cLcd(i2c, i2c_addr, 2, 16)

async def update_lcd(lcd):
  if lcd is None:
    return

  lcd.clear()
  lcd.move_to(0, 0)
  lcd.putstr("Initializing")
  lcd.move_to(0, 1)
  lcd.putstr("RuangSense-v2")
  await asyncio.sleep(2)
  lcd.clear()

  while True:
    lcd.move_to(0, 0)
    lcd.putstr(f"T:{payload['temp']}\xdfC H:{int(payload['humid'])}%")
    lcd.move_to(0, 1)
    lcd.putstr(f"G:{payload['gas']} ppm")
    await asyncio.sleep(1)

def mqtt_callback(topic, msg):
  print(f"[MQTT] Topic:{topic.decode()} | Message: {msg.decode()}")

async def mqtt_listener():
  while True:
    if client is not None:
      try:
        client.check_msg()
      except Exception as e:
        print("Error:", e)
    await asyncio.sleep(0.5)

async def send_telementry():
  while True:
    if client is not None:
      try:
        print("Sending payload:", payload)

        json_payload = ujson.dumps(payload).encode()
        print("[MQTT OUT] Mengirim data telemetri...")
        client.publish(config.TOPIC_DATA, json_payload)
      except Exception as e:
        print("Gagal mengirim data:", e)
        machine.reset()
    await asyncio.sleep(5)

def count_ppm(raw_adc):
  if raw_adc == 0:
    return 0

  RL_VALUE = 5  #Load resistance (5KΩ)
  RO_CLEAN_AIR = 9.83  #Clean air ratio

  # 1. Calculate voltage sensor (VRL)
  volts = raw_adc * (3.3 / 4095.0)
  if volts == 0:
    return 0

  # 2. Calculate resistance of the sensor (RS)
  # Formula: RS = ((VCC * RL) / VRL) - RL
  rs = ((3.3 * RL_VALUE) / volts) - RL_VALUE

  # 3. Calculate ratio (RS/RO)
  ratio = rs / RO_CLEAN_AIR

  # 4. Calculate PPM using logarithmic formula
  # log(ppm) = (log(ratio) - b) / m
  # For MQ-2, typical values are b = 1.27 and m = -0.47
  try:
    ppm_log = (math.log10(ratio) - 1.27) / -0.47
    return pow(10, ppm_log)
  except Exception as e:
    print("Error calculating PPM:", e)
    return 0

async def buzzer_control():
  buzzer = Pin(14, Pin.OUT)

  while True:
    if payload["gas"] >= 150 and payload["gas"] <= 400:
      buzzer.value(1)  # Turn on buzzer - danger zone
      await asyncio.sleep(0.5)
    elif payload["gas"] >= 70 and payload["gas"] < 150:
      buzzer.value(1)  # Turn on buzzer - warning zone
      await asyncio.sleep(1)
    else:
      buzzer.value(0)  # Turn off buzzer
      await asyncio.sleep(1)

async def main():
  global client
  print("--- RuangSense v2: Monitoring System ---")

  is_connected = connect_wifi(config.WIFI_SSID, config.WIFI_PASSWORD)
  lcd = setup_lcd()

  if is_connected and lcd:
    lcd.clear()
    lcd.putstr("Wifi OK!")
    await asyncio.sleep(1)
  elif not is_connected:
    return

  try:
    client = setup_mqtt()
    client.set_callback(mqtt_callback)
    client.connect()
    print("[MQTT] Connected to Broker!")
    client.publish(config.TOPIC_STATUS, b"online", retain=True)

    client.subscribe(config.TOPIC_COMMAND)
    print(f"[MQTT] Subscribe to {config.TOPIC_COMMAND.decode()}")

    await asyncio.gather(
      read_sensor(),
      buzzer_control(),
      update_lcd(lcd),
      mqtt_listener(),
      send_telementry()
    )
  except asyncio.CancelledError:
    print("Tasks cancelled.")
  except Exception as e:
    print("Error:", e)
  finally:
    if client is not None:
      try:
        client.publish(config.TOPIC_STATUS, b"offline", retain=True)
        client.disconnect()
      except Exception as e:
        pass

try:
  asyncio.run(main())
except KeyboardInterrupt:
  pass
