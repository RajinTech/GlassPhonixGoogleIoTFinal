const Gpio = require('pigpio').Gpio;

const insidePropane = new Gpio(27, {mode: Gpio.OUTPUT});
const insideOxygen = new Gpio(25, {mode: Gpio.OUTPUT});
const outsidePropane = new Gpio(23, {mode: Gpio.OUTPUT});
const outsideOxygen = new Gpio(24, {mode: Gpio.OUTPUT});

let dutyCycle = 0;

setInterval(() => {
  insidePropane.pwmWrite(dutyCycle);
  insideOxygen.pwmWrite(dutyCycle);
  outsidePropane.pwmWrite(dutyCycle);
  outsideOxygen.pwmWrite(dutyCycle);

  dutyCycle += 5;
  if (dutyCycle > 255) {
    dutyCycle = 0;
  }
}, 1000);
