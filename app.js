var exec = require('child_process').exec;
var util = require('util');
var fs = require('fs');
var needle = require('needle');
var nconf = require('nconf');
var Canvas = require('canvas'), Image = Canvas.Image, qrcode = require('jsqrcode')(Canvas);

nconf.argv().env();
nconf.file({ file: 'config.json' });

function runIt(seconds) {
  setTimeout(runFaucet, seconds * 1000);
}

function runFaucet()  {
  console.log('Hi')

  console.log('Taken');

  var cmd = 'fswebcam -d /dev/video0 -r 640x480 codes/code.jpg --jpeg 85 -S 2';
  exec(cmd, {encoding: 'binary', maxBuffer: 5000*1024});

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
          console.log(error);            
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

}

runFaucet();