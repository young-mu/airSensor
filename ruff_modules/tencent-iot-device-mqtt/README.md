## aliyun-iot-device-mqtt

[Aliyun IoT Hub](https://www.aliyun.com/product/iot) MQTT client for Node.js


## Installation

You can install it as dependency with npm.

```sh
$ # save into package.json dependencies with -S
$ rap install aliyun-iot-device-mqtt -S
```

## Usage

Aliyun IoT Hub mqtt client with authrozied by productKey & deviceName & deviceSecret.


### GET Data 

```js
const Mqtt = require('aliyun-iot-device-mqtt');

const client = Mqtt.createAliyunIotMqttClient({
    productKey: "",
    deviceName: "",
    deviceSecret: "",
    regionId: "cn-shanghai",

    keepalive:120 // mqtt options
});


client.on('connect', function() {
    console.log("connect")
})

client.end(function (){
    console.log("end")
})

```

### TLS mqtts
[aliyun_iot_root.cer](http://aliyun-iot.oss-cn-hangzhou.aliyuncs.com/cert_pub/root.crt)

```js
var trustedCA = fs.readFileSync(path.join(__dirname, '/aliyun_iot_root.cer'))

var options = {
    productKey: "",
    deviceName: "",
    deviceSecret: "",
    regionId: "cn-shanghai",
    protocol: 'mqtts',
    ca: trustedCA,

    keepalive:120 // mqtt options
};

```

### Subscribe Topic 

```js
client.subscribe(topic)

```
### Publish Message 

```js
client.publish(topic, 'Hello mqtt')
client.publish(topic, 'Hello mqtt', { qos: 1 })

```

### Receive Message 

```js
client.on('message', function(topic, message) {
    console.log(topic+"," + message.toString())
})

```

### Bugs

<img src='https://raw.githubusercontent.com/wongxming/dtalkNodejs/master/wongxming.jpg' width="240" height="240" />