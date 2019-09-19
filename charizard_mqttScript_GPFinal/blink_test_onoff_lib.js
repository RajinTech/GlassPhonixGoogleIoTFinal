const Gpio = require('onoff').Gpio; // Gpio class
const insidePropane = new Gpio(27, 'out');       // Export GPIO17 as an output
let stopBlinking = false;

// Toggle the state of the insidePropane connected to GPIO17 every 200ms
const blinkinsidePropane = () => {
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

  setTimeout(blinkinsidePropane, 20);
};

blinkinsidePropane();
