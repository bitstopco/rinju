var fs = require('fs');
var RaspiCam = require("raspicam");

var camera = new RaspiCam({
  mode: "photo",
  output: "qrcode.png",
  encoding: "png",
  timeout: 1, // take the picture immediately
  nopreview: true
});

function runIt(seconds) {
  camera.start();
  
  setTimeout(runFaucet, seconds * 1000);
}

function runFaucet() {

  // check if we have an image to work with
  fs.exists(__dirname + '/qrcode.png', function(exists) {
    if (exists) {
      // we do so now check if its a valid qr code
      console.log('We have image');

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

      fs.unlink(filename, function (err) {
        if (err) throw err;
        console.log('successfully deleted qrcode');
      });

    } else {
      // no image so check again
      console.log('No image');

      runIt('2');
    }
  });

}

runFaucet();
