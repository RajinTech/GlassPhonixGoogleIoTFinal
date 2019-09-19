/**
 * Copyright 2017, Google, Inc.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

// [START iot_mqtt_include]
const fs = require('fs');

const mqtt = require('mqtt');
const gpio = require('onoff').Gpio;
const sleep = require('sleep');
const {PubSub} = require('@google-cloud/pubsub');
const outsidePropane = new gpio(23, 'out');
const outsideOxygen = new gpio(24, 'out');
const insideOxygen = new gpio(25, 'out');
const insidePropane = new gpio(27, 'out');

console.log('Welcome! I am listening!');

var pulses = 0;
var pulseSpeed = 1;
var run = false;
// while(run === true){
//   console.log('while loop')
//   let m = 9
//   insidePropane.writeSync(1);
//   sleep.msleep(m);
//   insidePropane.writeSync(0);
//   sleep.msleep(m);
// }
function charizardListener(
) {
    // Creates a client
  const pubsub = new PubSub();

  // References an existing subscription
  const subscription = pubsub.subscription("my-subscription");

  // Create an event handler to handle messages
  let messageCount = 0;
  const messageHandler = message => {

    let ip = message.data.toString();
    let insidePropanecommand = ip.substr(32, 2);

    // Toggle the state of the LED connected to GPIO17 every 200ms

  function pulse(insidePropanecommand) {
      console.log(`insidePropanecommand ${insidePropanecommand}`)
      let n = parseInt(insidePropanecommand, 10);
      console.log(`n b4: ${n}`);

      if (n > 10){
        n = 10
      } else if (n < 1 ){
        n = 1
      } else if (isNaN(n)){
        n = 1
      }
      console.log(`n after: ${n}`);
      pulses = pulses + 1
      console.log(n);
      console.log('pulses');
      console.log(pulses);
      insidePropane.writeSync(1);
      sleep.msleep(n);
      insidePropane.writeSync(0);
      sleep.msleep(n);
  };

  let run = true;

    //pulse(insidePropanecommand);



    console.log(`Received message ${message.id}:`);
    console.log(`\tData: ${message.data}`);
    console.log(`\tAttributes: ${message.attributes}`);
    messageCount += 1;

    // "Ack" (acknowinsidePropanege receipt of) the message
    message.ack();
  };

  // Listen for new messages until timeout is hit
  subscription.on(`message`, messageHandler);
  // [END iot_mqtt_run]
}

 charizardListener();
