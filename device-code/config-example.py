WIFI_SSID = "Wifi SSID"
WIFI_PASSWORD = "wifiPassword"

DEVICE_ID="your-device-id"

URL_ENDPOINT="https://example.com"

MQTT_BROKER = "broker_url"
TOPIC_STATUS = ('device/' + DEVICE_ID + '/status').encode()
TOPIC_DATA = ('device/' + DEVICE_ID + '/data').encode()
TOPIC_COMMAND = ('device/' + DEVICE_ID + '/command').encode()