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
//const gpio = require('onoff').Gpio;
//const LED = new gpio(23, 'out');
const {PubSub} = require('@google-cloud/pubsub');

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
const {argv} = require(`yargs`)
  .options({
    projectId: {
      default: process.env.GCLOUD_PROJECT || process.env.GOOGLE_CLOUD_PROJECT,
      description:
        'The Project ID to use. Defaults to the value of the GCLOUD_PROJECT or GOOGLE_CLOUD_PROJECT environment variables.',
      requiresArg: true,
      type: 'string',
    },
    cloudRegion: {
      default: 'us-central1',
      description: 'GCP cloud region.',
      requiresArg: true,
      type: 'string',
    },
    registryId: {
      description: 'Cloud IoT registry ID.',
      requiresArg: true,
      demandOption: true,
      type: 'string',
    },
    deviceId: {
      description: 'Cloud IoT device ID.',
      requiresArg: true,
      demandOption: true,
      type: 'string',
    },
    privateKeyFile: {
      description: 'Path to private key file.',
      requiresArg: true,
      demandOption: true,
      type: 'string',
    },
    algorithm: {
      description: 'Encryption algorithm to generate the JWT.',
      requiresArg: true,
      demandOption: true,
      choices: ['RS256', 'ES256'],
      type: 'string',
    },
    tokenExpMins: {
      default: 20,
      description: 'Minutes to JWT token expiration.',
      requiresArg: true,
      type: 'number',
    },
    mqttBridgeHostname: {
      default: 'mqtt.googleapis.com',
      description: 'MQTT bridge hostname.',
      requiresArg: true,
      type: 'string',
    },
    mqttBridgePort: {
      default: 8883,
      description: 'MQTT bridge port.',
      requiresArg: true,
      type: 'number',
    },
  })
  .command(
    `mqttDeviceDemo`,
    `Connects a device, sends data, and receives data`,
    {
      messageType: {
        default: 'events',
        description: 'Message type to publish.',
        requiresArg: true,
        choices: ['events', 'state'],
        type: 'string',
      },
      numMessages: {
        default: 10,
        description: 'Number of messages to publish.',
        demandOption: true,
        type: 'number',
      },
    },
    opts => {
      mqttDeviceDemo(
        opts.deviceId,
        opts.registryId,
        opts.projectId,
        opts.cloudRegion,
        opts.algorithm,
        opts.privateKeyFile,
        opts.mqttBridgeHostname,
        opts.mqttBridgePort,
        opts.messageType,
        opts.numMessages
      );
    }
  )
  .command(
    `sendDataFromBoundDevice`,
    `Sends data from a gateway on behalf of a bound device.`,
    {
      gatewayId: {
        description: 'Cloud IoT gateway ID.',
        requiresArg: true,
        demandOption: true,
        type: 'string',
      },
      numMessages: {
        default: 10,
        description: 'Number of messages to publish.',
        demandOption: true,
        type: 'number',
      },
    },
    opts => {
      sendDataFromBoundDevice(
        opts.deviceId,
        opts.gatewayId,
        opts.registryId,
        opts.projectId,
        opts.cloudRegion,
        opts.algorithm,
        opts.privateKeyFile,
        opts.mqttBridgeHostname,
        opts.mqttBridgePort,
        opts.numMessages,
        opts.tokenExpMins
      );
    }
  )
  .command(
    `listenForConfigMessages`,
    `Listens for configuration changes on a gateway and bound device.`,
    {
      gatewayId: {
        description: 'Cloud IoT gateway ID.',
        requiresArg: true,
        demandOption: true,
        type: 'string',
      },
      clientDuration: {
        default: 60000,
        description: 'Duration in milliseconds for MQTT client to run.',
        requiresArg: true,
        type: 'number',
      },
    },
    opts => {
      listenForConfigMessages(
        opts.deviceId,
        opts.gatewayId,
        opts.registryId,
        opts.projectId,
        opts.cloudRegion,
        opts.algorithm,
        opts.privateKeyFile,
        opts.mqttBridgeHostname,
        opts.mqttBridgePort,
        opts.clientDuration
      );
    }
  )
  .command(
    `listenForErrorMessages`,
    `Listens for error messages on a gateway.`,
    {
      gatewayId: {
        description: 'Cloud IoT gateway ID.',
        requiresArg: true,
        demandOption: true,
        type: 'string',
      },
      clientDuration: {
        default: 60000,
        description: 'Duration in milliseconds for MQTT client to run.',
        requiresArg: true,
        type: 'number',
      },
    },
    opts => {
      listenForErrorMessages(
        opts.deviceId,
        opts.gatewayId,
        opts.registryId,
        opts.projectId,
        opts.cloudRegion,
        opts.algorithm,
        opts.privateKeyFile,
        opts.mqttBridgeHostname,
        opts.mqttBridgePort,
        opts.clientDuration
      );
    }
  )
  .example(
    `node $0 mqttDeviceDemo --projectId=blue-jet-123 \\\n\t--registryId=my-registry --deviceId=my-node-device \\\n\t--privateKeyFile=../rsa_private.pem --algorithm=RS256 \\\n\t--cloudRegion=us-central1 --numMessages=10 \\\n`
  )
  .example(
    `node $0 sendDataFromBoundDevice --projectId=blue-jet-123 \\\n\t--registryId=my-registry --deviceId=my-node-device \\\n\t--privateKeyFile=../rsa_private.pem --algorithm=RS256 \\\n\t--cloudRegion=us-central1 --gatewayId=my-node-gateway \\\n`
  )
  .example(
    `node $0 listenForConfigMessages --projectId=blue-jet-123 \\\n\t--registryId=my-registry --deviceId=my-node-device \\\n\t--privateKeyFile=../rsa_private.pem --algorithm=RS256 \\\n\t--cloudRegion=us-central1 --gatewayId=my-node-gateway \\\n\t--clientDuration=300000 \\\n`
  )
  .example(
    `node $0 listenForErrorMessages --projectId=blue-jet-123 \\\n\t--registryId=my-registry --deviceId=my-node-device \\\n\t--privateKeyFile=../rsa_private.pem --algorithm=RS256 \\\n\t--cloudRegion=us-central1 --gatewayId=my-node-gateway \\\n\t--clientDuration=300000 \\\n`
  )
  .wrap(120)
  .recommendCommands()
  .epilogue(`For more information, see https://cloud.google.com/iot-core/docs`)
  .help()
  .strict();

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

// Publish numMessages messages asynchronously, starting from message
// messagesSent.
// [START iot_mqtt_publish]
function publishAsync(
  mqttTopic,
  client,
  iatTime,
  messagesSent,
  numMessages,
  connectionArgs
) {
  // If we have published enough messages or backed off too many times, stop.
  if (messagesSent > numMessages || backoffTime >= MAXIMUM_BACKOFF_TIME) {
    if (backoffTime >= MAXIMUM_BACKOFF_TIME) {
      console.log('Backoff time is too high. Giving up.');
    }
    console.log('Closing connection to MQTT. Goodbye!');
    client.end();
    publishChainInProgress = false;
    return;
  }

  // Publish and schedule the next publish.
  publishChainInProgress = true;
  let publishDelayMs = 0;
  if (shouldBackoff) {
    publishDelayMs = 1000 * (backoffTime + Math.random());
    backoffTime *= 2;
    console.log(`Backing off for ${publishDelayMs}ms before publishing.`);
  }
  let LEDtoggle = 'off';
  if (messagesSent % 2 == 0) {
    LEDtoggle = 'on'
  } else {
    LEDtoggle = 'off'
  };
  setTimeout(() => {
    const payload = `${argv.registryId}/${argv.deviceId}-payload-${messagesSent}-${LEDtoggle}`;

    // Publish "payload" to the MQTT topic. qos=1 means at least once delivery.
    // Cloud IoT Core also supports qos=0 for at most once delivery.
    //function LEDon () {
    //  LED.writeSync(1)};
    //function LEDoff () {
    //  LED.writeSync(0)};
    //if (LED.readSync() === 0) {
    //  LED.writeSync(1);
    //} else {
    //  LED.writeSync(0);}




    console.log('Publishing message:', payload);
    client.publish(mqttTopic, payload, {qos: 1}, err => {
      if (!err) {
        shouldBackoff = false;
        backoffTime = MINIMUM_BACKOFF_TIME;
      }
    });

    const schedulePublishDelayMs = argv.messageType === 'events' ? 1000 : 2000;
    setTimeout(() => {
      // [START iot_mqtt_jwt_refresh]
      const secsFromIssue = parseInt(Date.now() / 1000) - iatTime;
      if (secsFromIssue > argv.tokenExpMins * 60) {
        iatTime = parseInt(Date.now() / 1000);
        console.log(`\tRefreshing token after ${secsFromIssue} seconds.`);

        client.end();
        connectionArgs.password = createJwt(
          argv.projectId,
          argv.privateKeyFile,
          argv.algorithm
        );
        connectionArgs.protocolId = 'MQTT';
        connectionArgs.protocolVersion = 4;
        connectionArgs.clean = true;
        client = mqtt.connect(connectionArgs);
        // [END iot_mqtt_jwt_refresh]

        client.on('connect', success => {
          console.log('connect');
          if (!success) {
            console.log('Client not connected...');
          } else if (!publishChainInProgress) {
            publishAsync(
              mqttTopic,
              client,
              iatTime,
              messagesSent,
              numMessages,
              connectionArgs
            );
          }
        });

        client.on('close', () => {
          console.log('close');
          shouldBackoff = true;
        });

        client.on('error', err => {
          console.log('error', err);
        });

        client.on('message', (topic, message) => {
          console.log(
            'message received: ',
            Buffer.from(message, 'base64').toString('ascii')
          );
        });

        client.on('packetsend', () => {
          // Note: logging packet send is very verbose
        });
      }
      publishAsync(
        mqttTopic,
        client,
        iatTime,
        messagesSent + 1,
        numMessages,
        connectionArgs
      );
    }, schedulePublishDelayMs);
  }, publishDelayMs);
}
// [END iot_mqtt_publish]

function mqttDeviceDemo(
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

  // const deviceId = `myDevice`;
  // const registryId = `myRegistry`;
  // const region = `us-central1`;
  // const algorithm = `RS256`;
  // const privateKeyFile = `./rsa_private.pem`;
  // const mqttBridgeHostname = `mqtt.googleapis.com`;
  // const mqttBridgePort = 8883;
  // const messageType = `events`;
  // const numMessages = 5;

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

  // Subscribe to the /devices/{device-id}/config topic to receive config updates.
  // Config updates are recommended to use QoS 1 (at least once delivery)
  client.subscribe(`/devices/${deviceId}/config`, {qos: 1});
  client.subscribe(`/devices/${deviceId}`, {qos: 1});

  // Subscribe to the /devices/{device-id}/commands/# topic to receive all
  // commands or to the /devices/{device-id}/commands/<subfolder> to just receive
  // messages published to a specific commands folder; we recommend you use
  // QoS 0 (at most once delivery)
  client.subscribe(`/devices/${deviceId}/commands/#`, {qos: 0});

  // The MQTT topic that this device will publish data to. The MQTT topic name is
  // required to be in the format below. The topic name must end in 'state' to
  // publish state and 'events' to publish telemetry. Note that this is not the
  // same as the device registry's Cloud Pub/Sub topic.
  const mqttTopic = `/devices/${deviceId}/${messageType}`;

  client.on('connect', success => {
    console.log('connect');
    if (!success) {
      console.log('Client not connected...');
    } else if (!publishChainInProgress) {
      publishAsync(mqttTopic, client, iatTime, 1, numMessages, connectionArgs);
    }
  });

  client.on('close', () => {
    console.log('close');
    shouldBackoff = true;
  });

  client.on('error', err => {
    console.log('error', err);
  });

  client.on('message', (topic, message) => {
    let messageStr = 'Message received: ';
    if (topic === `/devices/${deviceId}/config`) {
      messageStr = 'Config message received: ';
    } else if (topic === `/devices/${deviceId}/commands`) {
      messageStr = 'Command message received: ';
    } else if (topic === `/devices/${deviceId}`) {
      messageStr = 'Command message received: ';
    }

    messageStr += Buffer.from(message, 'base64').toString('ascii');
    console.log(messageStr);
  });

  client.on('packetsend', () => {
    // Note: logging packet send is very verbose
  });










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

  setTimeout(() => {
    subscription.removeListener('message', messageHandler);
    console.log(`${messageCount} message(s) received.`);
  }, 25000);











  // Once all of the messages have been published, the connection to Google Cloud
  // IoT will be closed and the process will exit. See the publishAsync method.
  // [END iot_mqtt_run]
}
