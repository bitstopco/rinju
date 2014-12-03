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
        console.log(result);
      } catch(e) {
        console.log(e);
      }
    }
    image.src = filename

  });

  runIt('3');
}

runFaucet();