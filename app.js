var fs = require('fs');
var Camera = require("camerapi");

var cam = new Camera();

cam.baseFolder(__dirname + '/codes');

cam.prepare({"timeout" : 150, 
         "width" : 2592,
         "height" : 1944,
         "quality" : 85
       }).takePicture("qrcode.jpg",callback);

function callback(file,error){

  console.log('Cool');

}