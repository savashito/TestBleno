var bleno = require('bleno');


var name = 'iRow raspberry RFduino';
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);


io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('ergData', function(data){
    packageErgEntry(data)
    console.log('message: ' , data);
  });
});

http.listen(8080, function(){
  console.log('listening on *:8080');
});


// var name = 'iRow erg RFduino';
var serviceUUID = '2220';
var characteristicUUIDRead = '2221'
var characteristicUUIDWrite = '2222'

bleno.on('stateChange', function(state) {
	console.log('on -> stateChange: ' + state);
	if (state === 'poweredOn') {
		bleno.startAdvertising(name,[serviceUUID]);
	} else {
		bleno.stopAdvertising();
	}
});


var data = new Buffer('Send me some data to display');

/*
// new characteristic added to the service
var readCharacteristic = new bleno.Characteristic({
    uuid : characteristicUUIDRead,
    properties : ['read','write'], // ['read','writeWithoutResponse'],

    onReadRequest : function(newData, offset, withoutResponse, callback) {
    	console.log("onReadRequest",newData);
        if(offset > 0) {
            callback(bleno.Characteristic.RESULT_INVALID_OFFSET);
        } else {
            // exec('sudo ./lcd "'+newData.toString('utf8')+'"');
            data = newData;
            callback(bleno.Characteristic.RESULT_SUCCESS);
        }
    },
     onSubscribe : function() {
    	console.log("onSubscribe");
        // maxValueSize, updateValueCallback
    },
     onUnsubscribe: function(){
        console.log("onUnsubscribe");
     }, // optional notify/indicate unsubscribe handler, function() { ...}
    onNotify: function(){
        console.log("onNotify");
    }, // optional notify sent handler, function() { ...}
    onIndicate: function(){
        console.log("onIndicate");
    }
})*/

var writeCharacteristic = new bleno.Characteristic({
    uuid : characteristicUUIDWrite,
    properties : ['write','read'], // ['read','writeWithoutResponse'],
    /*onReadRequest : function(offset, callback) {
        if(offset > data.length) {
            callback(bleno.Characteristic.RESULT_INVALID_OFFSET);
        } else {
            callback(bleno.Characteristic.RESULT_SUCCESS, data.slice(offset));
        }  confidence intervarl make sure 95 % 
        on case for one prior
    },*/
    onWriteRequest : function(newData, offset, withoutResponse, callback) {
    	console.log("onWriteRequest",newData);
        if(offset > 0) {
            callback(bleno.Characteristic.RESULT_INVALID_OFFSET);
        } else {
            // exec('sudo ./lcd "'+newData.toString('utf8')+'"');
            data = newData;
            callback(bleno.Characteristic.RESULT_SUCCESS);
        }
    },
     onReadRequest : function(offset,callback){//newData, offset, withoutResponse, callback) {
    	console.log("onReadRequest ",offset," Sending 07");
        var data = Buffer.from([0x69, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF,0xFF, 0xFF])
    	callback(bleno.Characteristic.RESULT_SUCCESS,data);
    },
    onSubscribe : function(maxValueSize, updateValueCallback) {
    	console.log("onSubscribe");
        /*setInterval(function() {
            sense.temperature('28-0000057cc14e', function(err, value) {
                updateValueCallback(new Buffer(value + 'C'));
            });
        }, 1000);*/
    },
    /*
     onUnsubscribe: function(){
        console.log("onUnsubscribe");
     }, // optional notify/indicate unsubscribe handler, function() { ...}
    onNotify: function(){
        console.log("onNotify");
    }, // optional notify sent handler, function() { ...}
    onIndicate: function(){
        console.log("onIndicate");
    }
    */
})
bleno.on('advertisingStart', function(error) {
	console.log('on -> advertisingStart: ' + (error ? 'error ' + error : 'success'));
	if (!error) {
		bleno.setServices([
			new bleno.PrimaryService({
				uuid : serviceUUID,
				characteristics : [
					// readCharacteristic,
					writeCharacteristic
					// add characteristics here
				]
			})
		]);
	}
});

/*
Button1Highlight.SetActive (!Button1Highlight.activeSelf);
		byte b = (byte)(Button1Highlight.activeSelf ? 0x01 : 0x00);
		BluetoothLEHardwareInterface.UpdateCharacteristicValue ("2221", new byte[] { b }, 1);

*/
// bleno.startAdvertising(name, serviceUUID[, callback(error)]);

// var uuid = 'e2c56db5dffb48d2b060d0f5a71096e0';
// var major = 0; // 0x0000 - 0xffff
// var minor = 0; // 0x0000 - 0xffff
// var measuredPower = -59; // -128 - 127

// // bleno.startAdvertisingIBeacon(uuid, major, minor, measuredPower[, callback(error)]);

