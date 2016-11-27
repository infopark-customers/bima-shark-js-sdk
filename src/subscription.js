"use strict";

var Subscription = (function () {
  function Subscription (instance, channelName, params) {
    this.instance = instance;
    this.channelIdentifier = channelName + "Channel";
    this.channelName = channelName;

    params = params || {};
    params["channel"] = this.channelIdentifier;
    createSubscriptionObject.call(this, params);
  };

  function createSubscriptionObject (params) {
    this.subscription = this.instance.actionCableConsumer.subscriptions.create(params, {
      received: function (data) {
        this.instance["on" + this.channelName].forEach(function (data, fn) {
          fn.call(this, data);
        }.bind(this, data));
      }.bind(this),

      rejected: function () {
        var error = "Connection to channel `" + this.channelIdentifier + "` ";
        error += "was rejected";

        throw new Error(error);
      }.bind(this)
    });
  };

  return Subscription;
})();

module.exports = Subscription;
