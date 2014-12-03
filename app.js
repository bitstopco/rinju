var fs = require('fs');
var Camelittle = require('camelittle');
var clInstance = new Camelittle({});
var Canvas = require('canvas'), Image = Canvas.Image, qrcode = require('jsqrcode')(Canvas);

function runIt(seconds) {
  setTimeout(runFaucet, seconds * 1000);
}

function runFaucet()  {
  console.log('Hi')

  clInstance.grab(function(err, image){
    console.log('Taken');

    fs.writeFileSync('codes/code.jpg', image, 'binary');

    var filename = __dirname + '/codes/code.jpg'

    var image = new Image()
    image.onload = function(){
    var result;
      try{
        result = qrcode.decode(image)
        var address = result.replace('bitcoin:','');
        console.log(address);

        fs.unlink(filename, function (err) {
          if (err) {
            console.log('Error deleting code');
          }
        });

        runIt('6'); // if we got an address then wait 6 seconds

      } catch(e) {
        console.log(e);
        runIt('3');
      }
    }
    image.src = filename

  });
}

runFaucet();