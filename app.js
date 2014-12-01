var fs = require('fs');

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
			  try{
			    result = qrcode.decode(image);
			    console.log('result of qr code: ' + result);
			  }catch(e){
			    console.log('unable to read qr code');
			  }
			}
			image.src = filename;
			
  	} else {
  		// no image so check again
    	console.log('No image');

    	setTimeout(runFaucet, 2 * 1000);
  	}
	});

}

runFaucet();