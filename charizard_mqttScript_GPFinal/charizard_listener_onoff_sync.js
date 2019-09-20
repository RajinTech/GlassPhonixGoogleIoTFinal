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
const Gpio = require('onoff').Gpio;
const sleep = require('sleep');
const {PubSub} = require('@google-cloud/pubsub');
//pi


console.log('Welcome! I am listening!');

let stopBlinking = false;

let insidePropanecommand = ""
let insideOxygencommand = ""
let outsidePropanecommand = ""
let outsideOxygencommand = ""

const insidePropane = new Gpio(27, 'out');       // Export GPIO17 as an output
const insideOxygen = new Gpio(25, 'out');       // Export GPIO17 as an output
const outsidePropane = new Gpio(23, 'out');       // Export GPIO17 as an output
const outsideOxygen = new Gpio(24, 'out');       // Export GPIO17 as an output

// Toggle the state of the LED connected to GPIO17 every 200ms
const ip = setInterval(_ => insidePropane.writeSync(insidePropane.readSync() ^ 1), 3.5);
const io = setInterval(_ => insideOxygen.writeSync(insidePropane.readSync() ^ 1), 3.5);
const op = setInterval(_ => outsidePropane.writeSync(insidePropane.readSync() ^ 1), 3.5);
const oo = setInterval(_ => outsideOxygen.writeSync(insidePropane.readSync() ^ 1), 3.5);

// Stop blinking the LED after 5 seconds
setTimeout(_ => {
  clearInterval(ip); // Stop blinking
  clearInterval(io); // Stop blinking
  clearInterval(op); // Stop blinking
  clearInterval(oo); // Stop blinking
  insidePropane.unexport();    // Unexport GPIO and free resources
  insideOxygen.unexport();    // Unexport GPIO and free resources
  outsidePropane.unexport();    // Unexport GPIO and free resources
  outsideOxygen.unexport();    // Unexport GPIO and free resources
}, 10000);

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

    let preData = message.data.toString().split('@')
    console.log(preData)




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

charizardListener();
