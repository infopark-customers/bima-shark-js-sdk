"use strict";

/*
 * @class
 */
var SubscriptionManager = (function () {
  /*
   * Management wrapper for ActionCable Websocket subscriptions
   *
   * @construtor
   * @param {BimaNotifications} instance
   */
  function SubscriptionManager (instance) {
    this.instance = instance;
    this.consumer = instance.actionCableConsumer;
    this.subscriptions = {};
    this.connectedChannels = [];

    createChannelSubscriptions.call(this);
  };
  /*
   * Unsubscribe and resubscribe to all channels
   *
   * @function
   * @name resubscribeToAllChannels
   * @access public
   */
  SubscriptionManager.prototype.resubscribeToAllChannels = function () {
    this.unsubscribeAllChannels();
    createChannelSubscriptions.call(this);
  };

  /*
   * Unsubscribe from all subscribed channels
   *
   * @function
   * @name unsubscribeAllChannels
   * @access public
   */
  SubscriptionManager.prototype.unsubscribeAllChannels = function () {
    Object.keys(this.subscriptions).forEach(function (channelName) {
      this.consumer.subscriptions.remove(this.subscriptions[channelName]);
      delete(this.subscriptions[channelName]);
      this.connectedChannels.splice(this.connectedChannels.indexOf(channelName), 1)
    }.bind(this));
  };

  // private

  function addConnectedChannel (channelName) {
    if (this.connectedChannels.indexOf(channelName) === -1) {
      this.connectedChannels.push(channelName);
      var channelsCount = BimaNotifications.channelNames().length;

      if (this.connectedChannels.length === channelsCount) {
        this.instance.subscriptionsInitialized = true;
        this.instance.subscriptionsInitializationsCount += 1;

        var data = { action: "subscriptions_initialized", data: null }
        performCallbacks.call(this, data);
      }
    }
  };

  function createChannelSubscriptions () {
    BimaNotifications.channelNames().forEach(function (channelName) {
      createSingleChannelSubscription.call(this, channelName);
    }.bind(this));
  };

  function createSingleChannelSubscription (channelName) {
    var params = subscriptionParamsForChannel.call(this, channelName);
    var subscription = this.consumer.subscriptions.create(params, {
      connected: function (channelName) {
        addConnectedChannel.call(this, channelName);
      }.bind(this, channelName),

      received: function (data) {
        performCallbacks.call(this, data);
      }.bind(this),

      rejected: function (channelName) {
        var error = "Connection to channel `" + channelName + "` was rejected";
        throw new Error(error);
      }.bind(this, channelName)
    });

    this.subscriptions[channelName] = subscription;
  };

  function performCallbacks (data) {
    this.instance.callbacks.forEach(function (data, fn) {
      fn.call(this, data);
    }.bind(this, data));
  };

  function subscriptionParamsForChannel (channelName) {
    return {
      accessId: this.instance.accessId,
      userId: this.instance.userId,
      channel: channelName
    };
  };

  return SubscriptionManager;
})();

module.exports = SubscriptionManager;
