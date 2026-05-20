WIFI_SSID = "Wifi SSID"
WIFI_PASSWORD = "wifiPassword"

DEVICE_ID="your-device-id"

URL_ENDPOINT="https://example.com"

MQTT_BROKER = "broker_url"
TOPIC_STATUS = ('ruangsense-v2/device/' + DEVICE_ID + '/status').encode()
TOPIC_DATA = ('ruangsense-v2/device/' + DEVICE_ID + '/data').encode()
TOPIC_COMMAND = ('ruangsense-v2/device/' + DEVICE_ID + '/command').encode()