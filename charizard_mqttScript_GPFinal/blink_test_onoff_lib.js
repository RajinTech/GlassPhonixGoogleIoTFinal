const Gpio = require('onoff').Gpio; // Gpio class
const insidePropane = new Gpio(27, 'out');       // Export GPIO27 as an output
let stopBlinking = false;


// Toggle the state of the insidePropane connected to GPIO17 every 200ms
let dutyCycle = 0;
let direction = 'up'
const ramp = () => {
  //ramp
  if (direction === 'up'){
    dutyCycle += 0.1;
  } else if ( direction === 'down'){
    dutyCycle -= 0.1;
  }
  //toggle direction
  if (dutyCycle == 10) {
    direction = 'down';
  } else if (dutyCycle == 0){
    direction = 'up'
  }
  setTimeout(ramp, 200)
}
const blinkinsidePropane = () => {


  console.log(direction)
  console.log(dutyCycle)
  //begin

  if (stopBlinking) {
    return insidePropane.unexport();
  }

  insidePropane.read((err, value) => { // Asynchronous read
    if (err) {
      throw err;
    }

    insidePropane.write(value ^ 1, err => { // Asynchronous write
      if (err) {
        throw err;
      }
    });
  });

  setTimeout(blinkinsidePropane, dutyCycle);
};
ramp();
blinkinsidePropane();
