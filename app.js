var fs = require('fs');
var RaspiCam = require("raspicam");

var camera = new RaspiCam({
  mode: "timelapse",
  output: "./codes/image_%06d.jpg",
  encoding: "jpg",
  timelapse: 2000,
  timeout: 12000,
  nopreview: true
});

camera.on("start", function( err, timestamp ){
  console.log("timelapse started at " + timestamp);
});

camera.on("read", function( err, timestamp, imagename ){
  console.log("timelapse image captured with filename: " + imagename);

  // process this baby
  var Canvas = require('canvas'), Image = Canvas.Image, qrcode = require('jsqrcode')(Canvas);

  var filename = __dirname + '/codes/' + imagename;

  var image = new Image();
  image.onload = function(){
    var result;
    try {
      result = qrcode.decode(image);
      console.log('result of qr code: ' + result);
    } catch(e) {
      console.log('unable to read qr code');
    }
  }
  image.src = filename;

});

camera.on("exit", function( timestamp ){
  console.log("timelapse child process has exited");
});

camera.on("stop", function( err, timestamp ){
  console.log("timelapse child process has been stopped at " + timestamp);
});

camera.start();

setTimeout(function(){
  camera.stop();
}, 9000);