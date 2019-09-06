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
const {PubSub} = require('@google-cloud/pubsub');
const outsidePropane = new gpio(23, 'out');
const outsideOxygen = new gpio(24, 'out');
const insideOxygen = new gpio(25, 'out');
const insidePropane = new gpio(27, 'out');

console.log('Welcome! I am listening!');

function  charizardListener(
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
    const iv = setInterval(_ => insidePropane.writeSync(insidePropane.readSync() ^ 1), 200);

    // Stop blinking the LED after 5 seconds
    setTimeout(_ => {
      clearInterval(iv); // Stop blinking
      insidePropane.unexport();    // Unexport GPIO and free resources
    }, 5000);




    // if ((message.data.toString()).endsWith('off')){
    //   insidePropanecommand = 'off'
    // } else if ((message.data.toString()).endsWith('on')) {
    //   insidePropanecommand = 'on'
    // };
    // if (insidePropanecommand === 'on') {
    //   insidePropane.writeSync(1);
    // } else if (insidePropanecommand === 'off') {
    //   insidePropane.writeSync(0);}
    console.log(`\tinsidePropanecommand: ${insidePropanecommand}`);

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
