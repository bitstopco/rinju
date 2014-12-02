var fs = require('fs');
var RaspiCam = require("raspicam");

var camera = new RaspiCam({
  mode: "timelapse",
  output: "./codes/image_%06d.jpg",
  encoding: "jpg",
  timelapse: 2000,
  nopreview: true
});

camera.on("start", function( err, timestamp ){
  console.log("timelapse started at " + timestamp);
});

camera.on("read", function( err, timestamp, filename ){
  console.log("timelapse image captured with filename: " + filename);
});

camera.on("exit", function( timestamp ){
  console.log("timelapse child process has exited");
});

camera.on("stop", function( err, timestamp ){
  console.log("timelapse child process has been stopped at " + timestamp);
});

camera.start();