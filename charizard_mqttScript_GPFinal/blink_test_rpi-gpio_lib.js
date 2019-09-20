var gpio = require('rpi-gpio')
var gpiop = gpio.promise;

gpiop.setup(27, gpio.DIR_OUT)
    .then(() => {
        return gpiop.write(27, true)
    })
    .catch((err) => {
        console.log('Error: ', err.toString())
    })
