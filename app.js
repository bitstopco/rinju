var fs = require('fs');
var needle = require('needle');
var nconf = require('nconf');
var Camelittle = require('camelittle');
var clInstance = new Camelittle({
  device: '/dev/video0',
  resolution: '1920x1080',
  'no-banner': null
});
var Canvas = require('canvas'), Image = Canvas.Image, qrcode = require('jsqrcode')(Canvas);

nconf.argv().env();
nconf.file({ file: 'config.json' });

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

        needle.get('https://blockchain.info/merchant/'+nconf.get('blockchain:guid')+'/payment?password='+nconf.get('blockchain:password')+'&second_password='+nconf.get('blockchain:secondpassword')+'&to='+address+'&amount='+nconf.get('blockchain:transaction:amount')+'&from='+nconf.get('blockchain:transaction:from')+'&note='+nconf.get('blockchain:transaction:note'), function(error, response) {
          if (!error && response.statusCode == 200) {
            console.log(response.body);
            console.log(response.body.message);
          } else {
            console.log('error');
            console.lof(error);            
          }
        });

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