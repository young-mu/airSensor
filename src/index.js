'use strict';

$.ready(function (error) {
    if (error) {
        console.log(error);
        return;
    }

    $('#led-b').turnOn();
    var count = 0;

    var attrs = {
        'temperature': 0,
        'humidity': 0,
        'pm1': 0,
        'pm25': 0,
        'pm10': 0,
        'hcho': 0,
        'tvoc': 0,
        'co2': 0
    };

    var MQTT = require('tencent-iot-device-mqtt');
    var options = require('./device_info.json');
    var client = MQTT.createTencentIoTClient(options);
    console.log('connect successfully');

    var sendDataTopic = '$thing/up/property/' + options.productKey + '/' + options.deviceName;
    var recvDataTopic = '$thing/down/property/' + options.productKey + '/' + options.deviceName;

    client.subscribe(recvDataTopic);
    client.on('message', function (topic, message) {
        var msgObj = JSON.parse(message.toString());
        if (msgObj.method == 'report_reply') {
            if (msgObj.code != 0) {
                console.log('publish reply failed', msgObj.status);
            } else {
                console.log('publish reply successfully (clientToken', msgObj.clientToken + ')');
            }
        }
    });

    function getPublishData (attrs, count) {
        var obj = {
            'method': 'report',
            'clientToken': count.toString(),
            'timestamp': Date.now() + (8 * 60 * 60 * 1000),
            'params': attrs
        };

        return JSON.stringify(obj);
    }

    function publishData (attrs) {
        var data = getPublishData(attrs, count++);
        client.publish(sendDataTopic, data, function (err) {
            if (err) {
                console.log('publish failed', err);
            }

            console.log('publish successfully', data);
        });
    }

    setInterval(function () {
        $('#air-sensor').readData(function (error, temp, hum, pm1, pm25, pm10, hcho, tvoc, co2) {
            if (error) {
                console.log('read failed', error);
                $('#led-r').flicker();
                publishData(attrs);
                return;
            }

            attrs.temperature = temp;
            attrs.humidity = hum;
            attrs.pm1 = pm1;
            attrs.pm25 = pm25;
            attrs.pm10 = pm10;
            attrs.hcho = hcho;
            attrs.tvoc = tvoc;
            attrs.co2 = co2;

            $('#led-g').flicker();

            var _date = new Date(Date.now() + (8 * 60 * 60 * 1000));
            var date = _date.toLocaleDateString();
            var time = _date.toLocaleTimeString();
            console.log('-----', date, time, '-----');
            console.log('温度:', attrs.temperature, ', 湿度:', attrs.humidity);
            console.log('PM1.0:', attrs.pm1, ', PM2.5:', attrs.pm25, ', PM10:', attrs.pm10);
            console.log('甲醛:', attrs.hcho, ', TVOC:', attrs.tvoc, ', CO2:', attrs.co2);

            publishData(attrs);
        });
    }, 10000);
});

$.end(function () {
    $('#led-b').turnOff();
    $('#led-r').turnOff();
    $('#led-g').turnOff();
});
