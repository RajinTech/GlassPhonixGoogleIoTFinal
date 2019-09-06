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
const jwt = require('jsonwebtoken');
const mqtt = require('mqtt');
const gpio = require('onoff').Gpio;
const {PubSub} = require('@google-cloud/pubsub');
const LED = new gpio(23, 'out');


const projectId = 'glassphonix'
const deviceId = `alfred`;
const registryId = `my-registry`;
const region = `us-central1`;
const algorithm = `RS256`;
const privateKeyFile = `rsa_private.pem`;
const mqttBridgeHostname = `mqtt.googleapis.com`;
const mqttBridgePort = 8883;
const messageType = `events`;
const numMessages = 5;
const tokenExpMins = 20;
// [END iot_mqtt_include]

// The initial backoff time after a disconnection occurs, in seconds.
const MINIMUM_BACKOFF_TIME = 1;

// The maximum backoff time before giving up, in seconds.
const MAXIMUM_BACKOFF_TIME = 32;

// Whether to wait with exponential backoff before publishing.
let shouldBackoff = false;

// The current backoff time.
let backoffTime = 1;

// Whether an asynchronous publish chain is in progress.
let publishChainInProgress = false;

console.log('Google Cloud IoT Core MQTT example.');



// Create a Cloud IoT Core JWT for the given project id, signed with the given
// private key.
// [START iot_mqtt_jwt]
function createJwt(projectId, privateKeyFile, algorithm) {
  // Create a JWT to authenticate this device. The device will be disconnected
  // after the token expires, and will have to reconnect with a new token. The
  // audience field should always be set to the GCP project id.
  const token = {
    iat: parseInt(Date.now() / 1000),
    exp: parseInt(Date.now() / 1000) + 20 * 60, // 20 minutes
    aud: projectId,
  };
  const privateKey = fs.readFileSync(privateKeyFile);
  return jwt.sign(token, privateKey, {algorithm: algorithm});
}
// [END iot_mqtt_jwt]


function alfredListener(
  deviceId,
  registryId,
  projectId,
  region,
  algorithm,
  privateKeyFile,
  mqttBridgeHostname,
  mqttBridgePort,
  messageType,
  numMessages
) {
  // [START iot_mqtt_run]


  // The mqttClientId is a unique string that identifies this device. For Google
  // Cloud IoT Core, it must be in the format below.
  const mqttClientId = `projects/${projectId}/locations/${region}/registries/${registryId}/devices/${deviceId}`;

  // With Google Cloud IoT Core, the username field is ignored, however it must be
  // non-empty. The password field is used to transmit a JWT to authorize the
  // device. The "mqtts" protocol causes the library to connect using SSL, which
  // is required for Cloud IoT Core.
  const connectionArgs = {
    host: mqttBridgeHostname,
    port: mqttBridgePort,
    clientId: mqttClientId,
    username: 'unused',
    password: createJwt(projectId, privateKeyFile, algorithm),
    protocol: 'mqtts',
    secureProtocol: 'TLSv1_2_method',
  };

  // Create a client, and connect to the Google MQTT bridge.
  const iatTime = parseInt(Date.now() / 1000);
  const client = mqtt.connect(connectionArgs);



  client.subscribe(`/devices/${deviceId}`, {qos: 1});



  // The MQTT topic that this device will publish data to. The MQTT topic name is
  // required to be in the format below. The topic name must end in 'state' to
  // publish state and 'events' to publish telemetry. Note that this is not the
  // same as the device registry's Cloud Pub/Sub topic.
  const mqttTopic = `/devices/${deviceId}/${messageType}`;











    // Creates a client
  const pubsub = new PubSub();

  /**
   * TODO(developer): Uncomment the following lines to run the sample.
   */
  // const subscriptionName = 'my-sub';
  // const timeout = 60;

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













  // Once all of the messages have been published, the connection to Google Cloud
  // IoT will be closed and the process will exit. See the publishAsync method.
  // [END iot_mqtt_run]
}

alfredListener(
  deviceId,
  registryId,
  projectId,
  region,
  algorithm,
  privateKeyFile,
  mqttBridgeHostname,
  mqttBridgePort,
  messageType,
  numMessages
);
