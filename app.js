var fs = require('fs');
var RaspiCam = require("raspicam");

var camera = new RaspiCam({
  mode: "photo",
  output: "qrcode.png",
  encoding: "png",
  timeout: 1
});


  camera.on("started", function( err, timestamp ){
    console.log("photo started at " + timestamp );
  });

  camera.on("read", function( err, timestamp, filename ){
    console.log("photo image captured with filename: " + filename );

    // process this baby
    var Canvas = require('canvas'), Image = Canvas.Image, qrcode = require('jsqrcode')(Canvas);

    var filename = __dirname + '/qrcode.png';

    var image = new Image();
    image.onload = function(){
      var result;
      try {
        result = qrcode.decode(image);
        console.log('result of qr code: ' + result);
      } catch(e) {
        console.log('unable to read qr code');
        runIt('2');
      }
    }
    image.src = filename;

  });

  camera.on("exit", function( timestamp ){
    console.log("photo child process has exited at " + timestamp );
  });

  camera.start();

