"use strict";

var Instance = (function () {
  function Instance (options) {
    options = options || {};

    this.webSocketUrl = options.webSocketUrl;
    this.appID = options.appID;
    this.userID = options.userID;
    this.subscriptions = [];

    this.reset();

    createSubscriptionCallbacks.call(this, options);
    createSubscriptions.call(this);
  };

  Instance.prototype.disconnect = function () {
    if (this.actionCableConsumer) {
      this.actionCableConsumer.disconnect();
      this.subscriptions = [];

      return true;
    }
  };

  Instance.prototype.reset = function () {
    if (typeof(this.actionCableConsumer) !== "undefined") {
      resetExistingActionCable.call(this);
    }
    else {
      createActionCableConsumer.call(this);
    }
  };

  // private

  function addCallback (callback, functions) {
    if (typeof(functions) === "function") {
      functions = [functions];
    }

    this[callback] = functions || [];
  };

  function callbackNames () {
    var names = [];

    BimaNotifications.channelNames().forEach(function (name) {
      names.push("on" + name);
    });

    return names;
  };

  function createActionCableConsumer () {
    try {
      var ActionCable = require("actioncable");

      this.actionCableConsumer = ActionCable.createConsumer(this.webSocketUrl);
      this.actionCableConsumer.connect();
    }
    catch (err) {
      throw new Error(err);
    }
  };

  function createSubscriptionCallbacks (options) {
    var callbacks = callbackNames();

    callbacks.forEach(function (name) {
      this[name] = [];
      addCallback.call(this, name, options[name]);
    }.bind(this));
  };

  function createSubscriptions () {
    var Subscription = require("./subscription");

    BimaNotifications.channelNames().forEach(function (name) {
      var params = { appID: this.appID, userID: this.userID };
      this.subscriptions.push(new Subscription(this, name, params));
    }.bind(this));
  };

  function resetExistingActionCable () {
    this.actionCableConsumer.disconnect();
    this.actionCableConsumer.connect();
  };

  return Instance;
})();

module.exports = Instance;
