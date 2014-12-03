var fs = require('fs');

function runIt(seconds) {
  setTimeout(runFaucet, seconds * 1000);
}

function runFaucet()  {
  console.log('Hi')

  runIt('3');
}

runFaucet();