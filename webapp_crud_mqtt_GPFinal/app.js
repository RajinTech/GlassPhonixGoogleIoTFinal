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

// Activate Google Cloud Trace and Debug when in production
if (process.env.NODE_ENV === 'production') {
  require('@google-cloud/trace-agent').start();
  require('@google-cloud/debug-agent').start();
}

const path = require('path');
const cors = require('cors');
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const config = require('./config');
const logging = require('./lib/logging');
const {Datastore} = require('@google-cloud/datastore');
const DatastoreStore = require('@google-cloud/connect-datastore')(session);

const app = express();

app.disable('etag');
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
app.set('trust proxy', true);

// Add the request logger before anything else so that it can
// accurately log requests.
app.use(logging.requestLogger);

//Enable Cross-Origin Resource Sharing
app.use(cors());

// Configure the session and session storage.
const sessionConfig = {
  resave: false,
  saveUninitialized: false,
  secret: config.get('SECRET'),
  signed: true,
  store: new DatastoreStore({
    dataset: new Datastore(),
    kind: 'express-sessions',
  }),
};

app.use(session(sessionConfig));

// OAuth2
app.use(passport.initialize());
app.use(passport.session());
app.use(require('./lib/oauth2').router);
app.use(express.static(path.join(__dirname, 'views')));
// Books
app.use('/books', require('./books/crud'));
app.use('/actions', require('./actions/crud'));
app.use('/api/books', require('./books/api'));
app.use('/api/actions', require('./actions/api'));
// Alfred
app.use('/alfred', require('./alfred/crud'));
app.use('/charizard', require('./charizard/crud'));
app.use('/gloria', require('./gloria/crud'));
// Set Homepage
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/views/home/', 'home.html'));
});

// Add the error logger after all middleware and routes so that
// it can log errors from the whole application. Any custom error
// handlers should go after this.
app.use(logging.errorLogger);

// Basic 404 handler
app.use((req, res) => {
  res.status(404).send('Not Found');
});

// Basic error handler
app.use((err, req, res) => {
  /* jshint unused:false */
  // If our routes specified a specific response, then send that. Otherwise,
  // send a generic message so as not to leak anything.
  res.status(500).send(err.response || 'Something broke!');
});

if (module === require.main) {
  // Start the server
  const server = app.listen(config.get('PORT'), () => {
    const port = server.address().port;
    console.log(`App listening on port ${port}`);
  });
}

module.exports = app;
