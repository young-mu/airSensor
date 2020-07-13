var crypto = require('crypto');
var mqtt = require('mqtt');

exports.createTencentIoTClient = function(opts) {

    if (!opts || !opts.productKey ||
        !opts.deviceSecret || !opts.deviceName) {
        throw new Error('options need productKey,deviceName,deviceSecret');
    }
    
    //CONNECT参数
    var options = {
        keepalive: opts.keepalive || 120, //120s
        rejectUnauthorized: false,
        clean: false, //cleanSession保持持久会话
        protocolVersion: 4 //MQTT v3.1.1
    }
    //1.生成clientId，username，password
    var iotData = getConnectData(opts.productKey, opts.deviceName, opts.deviceSecret);

    options.password = iotData.password
    options.clientId = opts.productKey+opts.deviceName
    options.username = iotData.username

    var url = "tcp://"+opts.productKey+".iotcloud.tencentdevices.com:1883";
    //2.建立连接
    return mqtt.connect(url, options);
}

/*
  参考文档：https://cloud.tencent.com/document/product/634/32546
*/
function getConnectData(productId, deviceName, deviceSecret) {
    // var d =Buffer.from("xUd8vvoDXCSCY9lsHuSbQQ==", 'base64')

    var sdkappid = "12010126";
    var connid = "JS" + Date.now();
    var expiry = parseInt(Date.now() / 1000 + 5 * 60); //秒数
    var contentStr = productId+deviceName+";"+sdkappid+";"+connid+";"+expiry;


    return {
        clientId: productId+deviceName,
        username: contentStr,
        password: crypto.createHmac('sha1', Buffer.from(deviceSecret, 'base64')).update(contentStr).digest('hex') + ";hmacsha1"
    }

}
