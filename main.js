var bleno = require('bleno');

var BlenoPrimaryService = bleno.PrimaryService;

var ErgTelemetryCharacteristic = require('./ergTelemetryCharacteristic');

console.log('ErgTelemetryService');
// uuidService = '6969'
//uuidService = '18902a9a-1f4a-44fe-936f-14c8eea41800';
uuidService = '6965'
bleno.on('stateChange', function(state) {
  console.log('on -> stateChange: ' + state);
  if (state === 'poweredOn') {
    bleno.startAdvertising('ErgTelemetryService', [uuidService]);
  } else {
    bleno.stopAdvertising();
  }
});

bleno.on('advertisingStart', function(error) {
  console.log('on -> advertisingStart: ' + (error ? 'error ' + error : 'success'));
  if (!error) {
    bleno.setServices([
      
      new BlenoPrimaryService({
        uuid: uuidService,
        characteristics: [
          new ErgTelemetryCharacteristic()

        ]
      })
    ]);
  }
});
