var rpio = require('../lib/rpio');

var pin = 11;

var buf = new Buffer(1024);
rpio.open(pin, rpio.INPUT, rpio.PULL_DOWN);

for (var i = 0; i < 5; i++) {
	/* On for 1 second */
	rpio.write(pin, rpio.HIGH);
	rpio.sleep(1);
	rpio.msleep(1);
	rpio.usleep(1);
	rpio.read(pin);

	/* Off for half a second (500ms) */
	rpio.write(pin, rpio.LOW);
	rpio.msleep(500);
	rpio.readbuf(pin, buf);
}