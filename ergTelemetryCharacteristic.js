var util = require('util');

var bleno = require('bleno');

var BlenoCharacteristic = bleno.Characteristic;

var ErgTelemetryCharacteristic = function() {
  ErgTelemetryCharacteristic.super_.call(this, {
    uuid: '6970',
    properties: ['read', 'write', 'notify'],
    value: null
  });
  // this._value = new Buffer(0);
  // this._updateValueCallback = null;
};

util.inherits(ErgTelemetryCharacteristic, BlenoCharacteristic);

ErgTelemetryCharacteristic.prototype.onReadRequest = function(offset, callback) {
  data = Buffer.from([69,69,69]);
  console.log('ErgTelemetryCharacteristic - onReadRequest: value = ' + data);
  callback(this.RESULT_SUCCESS, data);
};

ErgTelemetryCharacteristic.prototype.onWriteRequest = function(data, offset, withoutResponse, callback) {
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
