
var ManageBufferErg = function(buf) {
  this.sizeFloat = 4;
  this.sizeShort = 1;
  if(buf){
    this.buf = buf;
    this.index = 0;
  }else {
    this.buf = Buffer.allocUnsafe(5*4);// Buffer.from([69,69,69]);
    this.writeHeader();
  }
};

ManageBufferErg.prototype.writeHeader = function() {
  // Write header
  this.buf.writeInt8(69,0);
  this.buf.writeInt8(69,1);
  // var num = 69.9;
  // this.buf.writeInt8(num,1);

  // write version
  // this.buf.writeInt8(1,2);
  this.index = 2;
};
ManageBufferErg.prototype.readHeader = function() {
  // read header
  this.index = 2;
  return (69 == this.buf.readInt8(0) && 
      69 == this.buf.readInt8(1) );
      // && 1 == this.buf.readInt8(2));
};
ManageBufferErg.prototype.readFloat = function() {
  var v = this.buf.readFloatLE(this.index);
  // this.index++;
  this.index = this.index + this.sizeFloat;
  return v;
  // this.index = this.index+this.sizeFloat;
};

ManageBufferErg.prototype.readShort = function() {
  var v = this.buf.readInt8(this.index);
  // this.index++;
  this.index = this.index + this.sizeShort;
  return v;
  // this.index = this.index+this.sizeShort;
};
ManageBufferErg.prototype.writeShort = function(num) {
  // console.log("writeShort Index is --> ",this.index);
  this.buf.writeInt8(num,this.index);
  this.index = this.index+this.sizeShort;
};


ManageBufferErg.prototype.writeFloat = function(num) {
  this.buf.writeFloatLE(num,this.index);
  this.index = this.index+this.sizeFloat;
};

ManageBufferErg.prototype.getBuffer = function() {
  return this.buf;
};
ManageBufferErg.prototype.constructor = ManageBufferErg;




function packageErgEntry(ergData){
  var bufferErg = new ManageBufferErg(); //Object.create(ManageBuffer.prototype);
  
  // spm
  // console.log("trying to store ",typeof(ergData.spm),ergData.spm)
  bufferErg.writeShort(Number(ergData.spm));
  // distance
  bufferErg.writeFloat(Number(ergData.distance));
  // power
  bufferErg.writeFloat(Number(ergData.power));
  // pace
  bufferErg.writeFloat(Number(ergData.pace));
  // spm
  // bufferErg.writeFloat(Number(ergData.spm));
  // time
  bufferErg.writeFloat(Number(ergData.time));
  // calhr
  // bufferErg.writeFloat(Number(ergData.calhr));
  // calories
  // bufferErg.writeFloat(Number(ergData.calories));
  // forceplot
  // buf.writeFloatLE(value, offset);
  return bufferErg.getBuffer();
}

function unPackageErgEntry(ergBuffer){
  var bufferErg = new ManageBufferErg(ergBuffer); //Object.create(ManageBuffer.prototype);
  var ergData = undefined;
  if(bufferErg.readHeader()){
    console.log("Success correct header");
    ergData = {
        spm: bufferErg.readShort(),
        distance: bufferErg.readFloat(),
        power: bufferErg.readFloat(),
        pace: bufferErg.readFloat(),
        time: bufferErg.readFloat(),
        // calhr: bufferErg.readFloat(),
        // calories: bufferErg.readFloat()
      };
  }
  else{
    console.log("Error!! unsuported header");
  }
  return ergData;
}

module.exports = {
  ManageBufferErg:ManageBufferErg,
  packageErgEntry:packageErgEntry,
  unPackageErgEntry:unPackageErgEntry
};
