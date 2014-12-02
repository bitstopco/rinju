var fs = require('fs');
var RaspiCam = require("raspicam");

var camera = new RaspiCam({
  mode: "photo",
  output: "./codes/image_%06d.jpg",
  encoding: "jpg",
  timeout: 1,
  nopreview: true
});

function runIt(seconds) {
  setTimeout(runFaucet, seconds * 1000);
}

function runFaucet()  {
  camera.on("started", function( err, timestamp ){
    console.log("Taken");
  });

  camera.on("read", function( err, timestamp, imagename ){
    console.log("Process" + imagename );

    var filename = __dirname + '/codes/' + imagename;
    console.log(filename);

    var image = new Image();
    image.onload = function(){
      var result;
      try {
        result = qrcode.decode(image);
        console.log(result);
      } catch(e) {
        console.log(e);
      }
    }
    image.src = filename;

  });

  camera.on("exit", function( timestamp ){
    console.log("Done");
  });

  camera.start();
}

runFaucet();