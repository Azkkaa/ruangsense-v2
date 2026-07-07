import mqtt from 'mqtt'

const mqttClient = mqtt.connect(process.env.MQTT_BROKER)

mqttClient.on('connect', () => {
  console.log(`Connected to MQTT Broker: ${process.env.MQTT_BROKER}`);

  mqttClient.subscribe('ruangsense-v2/device/+/status');
  mqttClient.subscribe('ruangsense-v2/device/+/sensor_data');
});

export default mqttClient;