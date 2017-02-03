var util = require('util');
var bleno = require('bleno');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var manageBufferErg = require('./manageBufferErg');

var BlenoCharacteristic = bleno.Characteristic;

var currentErgData = undefined;//Buffer.from([69,69,69]);

// var data = {'cid':'2','status': 9, 'distance': '11.2', 'heartrate': 0, 'power': 6, 'calhr': 320.6496, 'calories': 0,'forceplot': [], 'pace': 387.8277952417603, 'spm': 51, 'time': 9.29}
// var packageData = manageBufferErg.packageErgEntry(data);
// var unpackData = manageBufferErg.unPackageErgEntry(packageData);
// console.log(packageData,unpackData);

// process.exit()




io.on('connection', function(socket){
  console.log('py erg connected');
  socket.on('ergData', function(data){
    currentErgData = manageBufferErg.packageErgEntry(data);
    console.log('ergData: ' , data);
  });
});

http.listen(8080, function(){
  console.log('listening on *:8080');
});


var ErgTelemetryCharacteristic = function() {
  ErgTelemetryCharacteristic.super_.call(this, {
    uuid: '6970',
    properties: ['read', 'write', 'notify'],
    value: null
  });
};

util.inherits(ErgTelemetryCharacteristic, BlenoCharacteristic);

ErgTelemetryCharacteristic.prototype.onReadRequest = function(offset, callback) {
  console.log('ErgTelemetryCharacteristic - onReadRequest: value = ' ,currentErgData);
  callback(this.RESULT_SUCCESS, currentErgData);
};

ErgTelemetryCharacteristic.prototype.onWriteRequest = function(data, offset, withoutResponse, callback) {
  console.log('ErgTelemetryCharacteristic - onWriteRequest : value = ' + data);
 /* this._value = data;
  console.log('ErgTelemetryCharacteristic - onWriteRequest: value = ' + this._value.toString('hex'));
  if (this._updateValueCallback) {
    console.log('ErgTelemetryCharacteristic - onWriteRequest: notifying');
    this._updateValueCallback(this._value);
  }*/
  callback(this.RESULT_SUCCESS);
};

ErgTelemetryCharacteristic.prototype.onSubscribe = function(maxValueSize, updateValueCallback) {
  console.log('ErgTelemetryCharacteristic - onSubscribe');
  // this._updateValueCallback = updateValueCallback;
};

ErgTelemetryCharacteristic.prototype.onUnsubscribe = function() {
  console.log('ErgTelemetryCharacteristic - onUnsubscribe');
  // this._updateValueCallback = null;
};

module.exports = ErgTelemetryCharacteristic;
