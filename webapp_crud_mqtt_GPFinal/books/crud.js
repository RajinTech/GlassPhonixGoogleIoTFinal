// Copyright 2017, Google, Inc.
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

'use strict';
//pubsub imports
const fs = require('fs');
const jwt = require('jsonwebtoken');
const mqtt = require('mqtt');

const {PubSub} = require('@google-cloud/pubsub');
//mqtt imports
const express = require('express');
const images = require('../lib/images');
const oauth2 = require('../lib/oauth2');
const model = require('./model-datastore');
const path = require('path');
const router = express.Router();

// Use the oauth middleware to automatically get the user's profile
// information and expose login/logout URLs to templates.
router.use(oauth2.template);

// Set Content-Type for all responses for these routes
router.use((req, res, next) => {
  res.set('Content-Type', 'text/html');
  next();
});

/**
 * GET /books
 *
 * Display a page of books (up to ten at a time).
 */
router.get('/', (req, res, next) => {
  model.list(10, req.query.pageToken, (err, entities, cursor) => {
    if (err) {
      next(err);
      return;
    }
    res.render('books/list.pug', {
      books: entities,
      nextPageToken: cursor,
    });
  });
});

// Use the oauth2.required middleware to ensure that only logged-in users
// can access this handler.
router.get('/mine', oauth2.required, (req, res, next) => {
  model.listBy(
    req.user.id,
    10,
    req.query.pageToken,
    (err, entities, cursor) => {
      if (err) {
        next(err);
        return;
      }
      res.render('books/list.pug', {
        books: entities,
        nextPageToken: cursor,
      });
    }
  );
});

/**
 * GET /books/add
 *
 * Display a form for creating a book.
 */
router.get('/add', (req, res) => {
  res.render('books/form.pug', {
    book: {},
    action: 'Add',
  });
});

router.get('/glassphonix', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/actions/', 'form.html'));
});
/**
 * POST /books/add
 *
 * Create a book.
 */
// [START add]
router.post(
  '/add',
  images.multer.single('image'),
  images.sendUploadToGCS,
  (req, res, next) => {

    const data = req.body;



    // If the user is logged in, set them as the creator of the book.
    if (req.user) {
      data.createdBy = req.user.displayName;
      data.createdById = req.user.id;
    } else {
      data.createdBy = 'Anonymous';
    }

    // Was an image uploaded? If so, we'll use its public URL
    // in cloud storage.
    if (req.file && req.file.cloudStoragePublicUrl) {
      data.imageUrl = req.file.cloudStoragePublicUrl;
    }

    // Save the data to the database.
    model.create(data, true, (err, savedData) => {
      if (err) {
        next(err);
        return;
      }
      console.log(`router post books crud data: saved data:`);
      console.log(data);
      console.log(savedData.led);
      console.log(`publish from here`)























































      //start pubsub
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
      const deviceId = `charlotte`;
      const projectId = 'glassphonix'
      const registryId = `my-registry`;
      const region = `us-central1`;
      const algorithm = `RS256`;
      const privateKeyFile = `./rsa_private.pem`;
      const mqttBridgeHostname = `mqtt.googleapis.com`;
      const mqttBridgePort = 8883;
      const messageType = `events`;
      const numMessages = 1;
      const tokenExpMins = 20;
      // [START iot_mqtt_include]
      const fs = require('fs');
      const jwt = require('jsonwebtoken');
      const mqtt = require('mqtt');
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

        setTimeout(() => {
          const payload = `${registryId}/${deviceId}-payload-IP${savedData.insidePropane}-alfredData-${savedData.led}`;

          // Publish "payload" to the MQTT topic. qos=1 means at least once delivery.
          // Cloud IoT Core also supports qos=0 for at most once delivery.





          console.log('Publishing message:', payload);
          client.publish(mqttTopic, payload, {qos: 1}, err => {
            if (!err) {
              shouldBackoff = false;
              backoffTime = MINIMUM_BACKOFF_TIME;
            }
          });

          const schedulePublishDelayMs = messageType === 'events' ? 1000 : 2000;
          setTimeout(() => {
            // [START iot_mqtt_jwt_refresh]
            const secsFromIssue = parseInt(Date.now() / 1000) - iatTime;
            if (secsFromIssue > tokenExpMins * 60) {
              iatTime = parseInt(Date.now() / 1000);
              console.log(`\tRefreshing token after ${secsFromIssue} seconds.`);

              client.end();
              connectionArgs.password = createJwt(
                projectId,
                privateKeyFile,
                algorithm
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


        // Once all of the messages have been published, the connection to Google Cloud
        // IoT will be closed and the process will exit. See the publishAsync method.
        // [END iot_mqtt_run]
      }
      //Convert data
      //Send Data to the topic

      mqttDeviceDemo(
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


















































      res.redirect(`${req.baseUrl}/${savedData.id}`);
    });
  }
);
// [END add]

/**
 * GET /books/:id/edit
 *
 * Display a book for editing.
 */
router.get('/:book/edit', (req, res, next) => {
  model.read(req.params.book, (err, entity) => {
    if (err) {
      next(err);
      return;
    }
    res.render('books/form.pug', {
      book: entity,
      action: 'Edit',
    });
  });
});

/**
 * POST /books/:id/edit
 *
 * Update a book.
 */
router.post(
  '/:book/edit',
  images.multer.single('image'),
  images.sendUploadToGCS,
  (req, res, next) => {
    const data = req.body;

    // Was an image uploaded? If so, we'll use its public URL
    // in cloud storage.
    if (req.file && req.file.cloudStoragePublicUrl) {
      req.body.imageUrl = req.file.cloudStoragePublicUrl;
    }

    model.update(req.params.book, data, true, (err, savedData) => {
      if (err) {
        next(err);
        return;
      }
      res.redirect(`${req.baseUrl}/${savedData.id}`);
    });
  }
);

/**
 * GET /books/:id
 *
 * Display a book.
 */
router.get('/:book', (req, res, next) => {
  model.read(req.params.book, (err, entity) => {
    if (err) {
      next(err);
      return;
    }
    res.render('books/view.pug', {
      book: entity,
    });
  });
});

/**
 * GET /books/:id/delete
 *
 * Delete a book.
 */
router.get('/:book/delete', (req, res, next) => {
  model.delete(req.params.book, err => {
    if (err) {
      next(err);
      return;
    }
    res.redirect(req.baseUrl);
  });
});

/**
 * Errors on "/books/*" routes.
 */
router.use((err, req, res, next) => {
  // Format error and forward to generic error handler for logging and
  // responding to the request
  err.response = err.message;
  next(err);
});

module.exports = router;
