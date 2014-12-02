var fs = require('fs');
var RaspiCam = require("raspicam");

var camera = new RaspiCam({
  mode: "photo",
  output: "./codes/image_%06d.jpg",
  encoding: "jpg",
  timeout: 2,
  nopreview: true
});

function runIt(seconds) {
  setTimeout(runFaucet, seconds * 1000);
}

function runFaucet()  {
 
  camera.on("read", function( err, timestamp, imagename ){
    console.log("Process" + imagename );

    // process this baby
    var Canvas = require('canvas'), Image = Canvas.Image, qrcode = require('jsqrcode')(Canvas);

    var filename = __dirname + '/codes/' + imagename;
    console.log(filename);

    var image = new Image();
    image.onload = function(){
      var result;
      try {
        result = qrcode.decode(image);
        console.log(result);

        runIt('2');
      } catch(e) {
        console.log(e);

        runIt('2');
      }
    }
    image.src = filename;

  });

  camera.start();
}

runFaucet();