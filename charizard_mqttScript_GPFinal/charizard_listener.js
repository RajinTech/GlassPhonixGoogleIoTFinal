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
const LED = new gpio(27, 'out');

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
    let LEDcommand = '';
    if ((message.data.toString()).endsWith('off')){
      LEDcommand = 'off'
    } else if ((message.data.toString()).endsWith('on')) {
      LEDcommand = 'on'
    };
    if (LEDcommand === 'on') {
      LED.writeSync(1);
    } else if (LEDcommand === 'off') {
      LED.writeSync(0);}
    console.log(`\tLEDcommand: ${LEDcommand}`);

    console.log(`Received message ${message.id}:`);
    console.log(`\tData: ${message.data}`);
    console.log(`\tAttributes: ${message.attributes}`);
    messageCount += 1;

    // "Ack" (acknowledge receipt of) the message
    message.ack();
  };

  // Listen for new messages until timeout is hit
  subscription.on(`message`, messageHandler);
  // [END iot_mqtt_run]
}

 charizardListener();
