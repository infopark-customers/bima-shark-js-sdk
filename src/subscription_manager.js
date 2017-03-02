"use strict";

/**
 * @class SubscriptionManager
 * @classdesc Management wrapper class for ActionCable Websocket subscriptions
 * @param {NotificationService} instance - Instance of NotificationService
 * @private
 */
var SubscriptionManager = (function () {
  /** @private **/
  var connectedChannels = null;

  /** @construtor **/
  function SubscriptionManager (instance) {
    /**
     * @name SubscriptionManager#instance
     * @type NotificationService
     */
    this.instance = instance;

    this.consumer = instance._actionCableConsumer;
    this.subscriptions = {};

    connectedChannels = [];
    createChannelSubscriptions.call(this);
  };
  /**
   * Unsubscribe and resubscribe to all channels
   *
   * @function
   * @name SubscriptionManager#resubscribeToAllChannels
   */
  SubscriptionManager.prototype.resubscribeToAllChannels = function () {
    this.unsubscribeAllChannels();
    createChannelSubscriptions.call(this);
  };

  /**
   * Unsubscribe from all subscribed channels
   *
   * @function
   * @name SubscriptionManager#unsubscribeAllChannels
   */
  SubscriptionManager.prototype.unsubscribeAllChannels = function () {
    Object.keys(this.subscriptions).forEach(function (channelName) {
      this.consumer.subscriptions.remove(this.subscriptions[channelName]);
      delete(this.subscriptions[channelName]);
      connectedChannels.splice(connectedChannels.indexOf(channelName), 1);
    }.bind(this));
  };

  // private

  function addConnectedChannel (channelName) {
    if (connectedChannels.indexOf(channelName) === -1) {
      connectedChannels.push(channelName);
      var channelsCount = NotificationService.channelNames.length;

      if (connectedChannels.length === channelsCount) {
        this.instance.subscriptionsInitialized = true;
        this.instance.subscriptionsInitializationsCount += 1;

        var data = { action: "subscriptions_initialized", data: null }
        performCallbacks.call(this, data);
      }
    }
  };

  function createChannelSubscriptions () {
    NotificationService.channelNames.forEach(function (channelName) {
      createSingleChannelSubscription.call(this, channelName);
    }.bind(this));
  };

  function createSingleChannelSubscription (channelName) {
    var params = subscriptionParamsForChannel.call(this, channelName);

    // console.log("new connection try");

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
      accessId: this.instance.configuration.accessId,
      userId: this.instance.configuration.userId,
      channel: channelName
    };
  };

  return SubscriptionManager;
})();

module.exports = SubscriptionManager;
