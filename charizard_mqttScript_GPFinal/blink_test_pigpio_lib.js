const Gpio = require('pigpio').Gpio;

const insidePropane = new Gpio(27, {mode: Gpio.OUTPUT});
const insideOxygen = new Gpio(25, {mode: Gpio.OUTPUT});
const outsidePropane = new Gpio(23, {mode: Gpio.OUTPUT});
const outsideOxygen = new Gpio(24, {mode: Gpio.OUTPUT});

let dutyCycle = 0;
let direction = 'up'
setInterval(() => {
  insidePropane.pwmWrite(200);
  insideOxygen.pwmWrite(250);
  //outsidePropane.pwmWrite(dutyCycle);
  //outsideOxygen.pwmWrite(dutyCycle);

  console.log(dutyCycle)
  if (direction === 'up'){
    dutyCycle += 5;
  } else if ( direction === 'down'){
    dutyCycle -= 5;
  }


  if (dutyCycle == 255) {
    direction = 'down';
  } else if (dutyCycle == 150){
    direction = 'up'
  }

}, 100);
