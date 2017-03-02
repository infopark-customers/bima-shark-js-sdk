# bima-notifications-js-sdk

This is the JS SDK for the [BIma notifications app](https://github.com/infopark-customers/bima-notifications). It can mainly be used to receive notifications for users in our frontend apps.

## Technical background

### Services used

* Node.JS ` >= 5.0.0. `
* [Webpack](https://webpack.github.io/) for local development and as SDK bundler 

## Requirements

* jQuery
* The SDK is mainly made for usage in the browser 

## Installation

### In Node.JS environments

If you have in your app an local Node.JS env and ` package.json ` follow these steps:

1. Add ` "bima-notifications-sdk": "git@github.com:infopark-customers/bima-notifications-js-sdk.git" ` to your ` package.json `.
2. Run ` npm install `
3. Done. 

### In browser enviroments

If you don't have Node.JS locally, you could use the already pre-build versions of the SDK.
Just link any version which is available under ` dist/ ` in your app.


In both ways you can use the SDK through the global class ` NotificationService `.

## Usage

Checkout ` test/server/assets/javascripts/notifications.js `. This gives you an full example how to use the notification service SDK.

### Docs

All methods in SDK are documented with [JSDoc](http://usejsdoc.org/). You can generate the doc files locally. Run therefore ` npm install -g jsdoc ` and ` npm run docs `. After that you have a full-HTML documentation of the SDK under ` /docs `.

## Testing

### Unit tests

Unit tests of the SDK are realized with [Jasmine](https://jasmine.github.io/). They live under ` test/unit ` folder. Just run ` npm test ` or ` npm run watch-test ` to execute them.

### Test server

The SDK has an own test server app which can demonstrate the whole notifications SDK on a local website. It works with Ruby and the [Sinatra](http://www.sinatrarb.com/) framework. You can set it up the following way:

1. Go to ` test/server `
2. Run ` bundle install there `
3. Add the following lines in the ` config/bima_http.yml ` config in the ` bima-doorkeeper ` *AND* ` bima-notifications ` app.

```yaml 
notifications_js_sdk_test_server:
	access_id: "notifications_js_sdk_test_server"
	secret_key: "jEfHfCOfy7oXyfv93cLzoyvJrIgfbpLVgAtgJDfFwSakKYwV/jH5wrsLbjV8QTYBqkge1DSTDZDZM7YS93KKRg=="
```

4. Start `bima-doorkeeper ` app in ` development ` or ` test ` under port ` 3001 `.
5. Run ` bundle exec rake api:apps:setup ` once before in ` bima-notifications ` app and start the server in ` development ` or ` test ` mode under port ` 3004 `.
6. Execute ` bundle exec rackup ` in the test server directory.
7. Open [http://0.0.0.0:9292](http://0.0.0.0:9292) in your browser.
8. Done.   	