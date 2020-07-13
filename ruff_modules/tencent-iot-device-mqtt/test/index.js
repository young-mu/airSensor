var mqtt = require('../index');
var fs = require('fs')
var path = require('path')
//var trustedCA = fs.readFileSync(path.join(__dirname, '/aliyun_iot_root.cer'))

var options = {
    productKey: "",
    deviceName: "",
    deviceSecret: "",
    regionId: "cn-shanghai",
    
    //protocol: 'mqtts',
    //ca: trustedCA,
};

var client = mqtt.createAliyunIotMqttClient(options);

var topic = options.productKey+'/'+options.deviceName+'/update';

client.subscribe(topic)

client.publish(topic, 'Hello mqtt !')

client.on('message', function(topic, message) {
    console.log(topic + "," + message.toString())
})