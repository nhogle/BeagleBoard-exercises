#!/usr/bin/env node
// From https://github.com/sandeepmistry/node-sensortag
// Install:
// apt-get install libbluetooth-dev bluez
// npm install -g sensortag
// hcitool lescan
// export BLE=90:59:AF:0B:84:57
//hcitool lecc $BLE

// Reads temperature

var util = require('util');

var async = require('async');

var SensorTag = require('sensortag');

var fs = require('fs');

var demoNumber = 0;
var maxDemo = 8;
cntFile  = "/tmp/demo.txt"
tempFile = "/tmp/temp.txt"
accFile  = "/tmp/acc.txt"

console.log("Be sure sensorTag is on");

SensorTag.discover(function(sensorTag) {
  console.log('sensorTag = ' + sensorTag);
  sensorTag.on('disconnect', function() {
    console.log('disconnected!');
    process.exit(0);
  });

  async.series([
      function(callback) {
        console.log('connect');
        fs.writeFile(cntFile, maxDemo);
        sensorTag.connect(callback);
      },
      function(callback) {
        console.log('discoverServicesAndCharacteristics');
        sensorTag.discoverServicesAndCharacteristics(callback);
      },
      function(callback) {
        console.log('enableIrTemperature');
        sensorTag.enableIrTemperature(callback);
      },
      function(callback) {
        setTimeout(callback, 100);
      },
      function(callback) {
        console.log('readIrTemperature');
        sensorTag.readIrTemperature(function(objectTemperature, ambientTemperature) {
          console.log('\tobject temperature = %d °C', objectTemperature.toFixed(1));
          console.log('\tambient temperature = %d °C', ambientTemperature.toFixed(1));

          callback();
        });

        sensorTag.on('irTemperatureChange', function(objectTemperature, ambientTemperature) {
          console.log('\tobject temperature = %d °C', objectTemperature.toFixed(1));
          // console.log('\tambient temperature = %d °C', ambientTemperature.toFixed(1));
          fs.writeFile(tempFile, objectTemperature + '\n', function (err) {
            if (err) throw err;
            // console.log('It\'s saved!');
          });
        });

        sensorTag.notifyIrTemperature(function() {
          console.log('notifyIrTemperature');
        });
      },
      // function(callback) {
      //   console.log('disableIrTemperature');
      //   sensorTag.disableAccelerometer(callback);
      // },
      
      function(callback) {
        console.log('enableAccelerometer');
        sensorTag.enableAccelerometer(callback);
      },
      function(callback) {
        setTimeout(callback, 10);
      },
      function(callback) {
        console.log('readAccelerometer');
        sensorTag.readAccelerometer(function(x, y, z) {
          console.log('\tx = %d G', x.toFixed(1));
          console.log('\ty = %d G', y.toFixed(1));
          console.log('\tz = %d G', z.toFixed(1));

          callback();
        });

        sensorTag.on('accelerometerChange', function(x, y, z) {
          console.log('\tx = %d G', x.toFixed(1));
          console.log('\ty = %d G', y.toFixed(1));
          console.log('\tz = %d G', z.toFixed(1));
          fs.writeFile(accFile, x + ' ' + y + ' ' + z + '\n', function (err) {
            if (err) throw err;
            // console.log('It\'s saved!');
          });
        });

        sensorTag.notifyAccelerometer(function() {

        });
      },
      
      // function(callback) {
      //   console.log('enableGyroscope');
      //   sensorTag.enableGyroscope(callback);
      // },
      // function(callback) {
      //   setTimeout(callback, 1000);
      // },
      // function(callback) {
      //   console.log('readGyroscope');
      //   sensorTag.readGyroscope(function(x, y, z) {
      //     console.log('\tx = %d °/s', x.toFixed(1));
      //     console.log('\ty = %d °/s', y.toFixed(1));
      //     console.log('\tz = %d °/s', z.toFixed(1));

      //     callback();
      //   });

      //   sensorTag.on('gyroscopeChange', function(x, y, z) {
      //     console.log('\tx = %d °/s', x.toFixed(1));
      //     console.log('\ty = %d °/s', y.toFixed(1));
      //     console.log('\tz = %d °/s', z.toFixed(1));
      //   });

      //   sensorTag.notifyGyroscope(function() {

      //   });
      // },
      // function(callback) {
      //   console.log('disableGyroscope');
      //   sensorTag.disableGyroscope(callback);
      // },
      
      function(callback) {
        console.log('readSimpleRead');
        sensorTag.on('simpleKeyChange', function(left, right) {
          console.log('left: ' + left);
          console.log('right: ' + right);

          if (left) {
            demoNumber++;
            if(demoNumber > maxDemo) {
              demoNumber = 0;
            }
          }
          if(right) {
            demoNumber--;
            if(demoNumber<0) {
              demoNumber = maxDemo;
            }
          }
          console.log('demoNumber = ' + demoNumber);
          fs.writeFile(cntFile, demoNumber, function (err) {
            if (err) throw err;
            // console.log('It\'s saved!');
          });
          if (left && right) {
            sensorTag.notifySimpleKey(callback);
          }
        });

        sensorTag.notifySimpleKey(function() {

        });
      },
      function(callback) {
        console.log('disconnect');
        fs.writeFile(cntFile, 0, function (err) {
            if (err) throw err;
          });
        sensorTag.disconnect(callback);
      }
    ]
  );
});
