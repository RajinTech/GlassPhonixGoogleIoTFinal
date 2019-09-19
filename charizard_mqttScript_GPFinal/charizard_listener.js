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
//pi
//const Gpio = require('pigpio').Gpio;
const outsidePropane = new gpio(23, 'out');
const outsideOxygen = new gpio(24, 'out');
const insideOxygen = new gpio(25, 'out');
const insidePropane = new gpio(27, 'out');

console.log('Welcome! I am listening!');

let stopBlinking = false;

let insidePropanecommand = ""
let insideOxygencommand = ""
let outsidePropanecommand = ""
let outsideOxygencommand = ""

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

  setTimeout(blinkinsidePropane, insidePropanecommand);
};



function charizardListener(
) {
    // Creates a client
  const pubsub = new PubSub();

  // References an existing subscription
  const subscription = pubsub.subscription("my-subscription");

  // Create an event handler to handle messages
  let messageCount = 0;
  const messageHandler = message => {

    insidePropanecommand = parseFloat(message.data.toString().substr(32, 2))/10;
    insideOxygencommand = parseFloat(message.data.toString().substr(37, 2))/10;
    outsidePropanecommand = parseFloat(message.data.toString().substr(42, 2))/10;
    outsideOxygencommand = parseFloat(message.data.toString().substr(47, 2))/10;




    console.log(`${isNaN(insidePropanecommand)}`);
    console.log(`\tinsidePropanecommand: ${insidePropanecommand}`);
    console.log(`\tinsideOxygencommand: ${insideOxygencommand}`);
    console.log(`\toutsidePropanecommand: ${outsidePropanecommand}`);
    console.log(`\toutsideOxygencommand: ${outsideOxygencommand}`);

    console.log(`Received message ${message.id}:`);
    console.log(`\tData: ${message.data}`);
    console.log(`\tAttributes: ${message.attributes}`);
    messageCount += 1;

    // "Ack" (acknowinsidePropanege receipt of) the message
    message.ack();
  };

  // Listen for new messages until timeout is hit
  subscription.on(`message`, messageHandler);
  // if (insidePropanecommand =='2'){
  //   console.log(`high`)
  //   insidePropane.writeSync(1);
  // } else if ( insidePropanecommand =='1'){
  //   console.log(`low`)
  //
  //   insidePropane.writeSync(0);
  // }
  // [END iot_mqtt_run]
}
blinkinsidePropane();
charizardListener();
