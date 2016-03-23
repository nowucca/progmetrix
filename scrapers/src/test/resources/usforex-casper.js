/*
 * Copyright 2007-2015, Steven Atkinson. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var casper = require('casper').create({
  viewportSize: {width: 1024, height: 768},
  logLevel: "debug",
  verbose: true,
  pageSettings: { userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2490.86 Safari/537.36" }
});

var mouse = require("mouse").create(casper);

var url = 'https://www.usforex.com/login/login';

var fs = require('fs');
var utils = require('utils');
var config = JSON.parse(fs.read('./src/test/resources/usforex.config'));

casper.start(url, function openedLoginPage() {
    this.echo(this.getTitle());
});


casper.then(function fillUserPass() {
    this.fill('form#loginForm', {
   'Username': config.username,
   'Password': config.password
  }, false);
});

casper.thenClick('#loginButton', function loginClicked() {
  this.echo("Logging in...");
});

casper.waitForSelector('#getAQuote > fieldset > table > tbody > tr > td:nth-child(2) > div > button',
  function quoteFormLoaded() {
      this.echo("Logged in!");
  },
  function loginTimeout() {
      this.echo("Could not detected quote form '#getAQuote > fieldset > table > tbody > tr > td:nth-child(2) > div > button'");
  },
  20000
);

casper.thenClick('#getAQuote > fieldset > table > tbody > tr > td:nth-child(2) > div > button',
  function quoteRequested() {
    this.echo("Quote requested...");
  }
);

casper.waitForSelector('#quoteDetails',
  function detailsAppeared() {
      this.echo(this.getHTML('#quoteDetails'));
      this.captureSelector("usforex.png", '#quoteDetails');
  },
  function detailsTimeout() {
      this.echo("No details - timed out.");
  },
  10000
);

casper.run();
