/** @global **/
(function (global) {
  "use strict";

  /**
   * @class BimaNotifications
   * @classdesc Class to manage and receive notifications in BImA applications
   *
   * @param {Object} options - object hash with the settings
   * @param {string} options.url - Basic URL to the API endpoint of the
   * Notification service
   * IMPORTANT: Please use here without any protocol and extra paths! (Example:
   * localhost:5000)
   * @param {string} options.accessId - App access ID for the BImA
   * notification service
   * @param {string} options.serviceToken - Service Token for BImA Doorkeeper
   * app to access the API
   * @param {string} options.userId - User ID related with the given serviceToken
   * @param {boolean} options.useHttps - Set true if API endpoint should be
   * called with https [default: true]
   * @param {Object} options.jQuery - jQuery object with .ajax function
   * [default: jQuery | window.jQuery]
   * @param {(function|Object[])} options.callbacks - function or
   * array of functions which should be executed when a notification was
   * received
   * @throws An error if any if the required option properties is missing or
   * has a wrong format
   */
  global.BimaNotifications = (function () {
    /** @private **/
    var subscriptionManager = null;

    /** * @construtor */
    function BimaNotifications (options) {
      options = options || {};

      this.configuration = {};

      this.configuration.url = options.url;
      this.configuration.accessId = options.accessId;
      this.configuration.serviceToken = options.serviceToken;
      this.configuration.userId = options.userId;
      this.configuration.useHttps = options.useHttps;
      this.configuration.jQuery = options.jQuery || jQuery || window.jQuery || $;

      if (typeof(this.configuration.useHttps) === "undefined") {
        this.configuration.useHttps = true;
      }

      this.callbacks = options.callbacks;

      if (typeof(this.callbacks) !== "undefined" && typeof(this.callbacks) === "function") {
        this.callbacks = [callbacks];
      }
      else if (typeof(this.callbacks) === "object") {
        this.callbacks = this.callbacks;
      }
      else {
        this.callbacks = [];
      }

      this.subscriptionsInitialized = false;
      this.subscriptionsInitializationsCount = 0;

      setFullSocketUrl.call(this);
      setFinalConfiguration.call(this);
      setActionCableConsumer.call(this);
      setSubscriptionManagerInstance.call(this);
      setApiInstance.call(this);
    };

    /**
     * Names of the notification channels
     *
     * @name BimaNotifications.channelNames
     * @type Array
     * @readonly
     */
    BimaNotifications.channelNames = Object.freeze([
      "GlobalNotificationsChannel",
      "UserNotificationsChannel"
    ]);

    /**
     * Keys for configuration which are editable
     *
     * @name BimaNotifications.editableConfigurationKeys
     * @type Array
     * @readonly
     */
    BimaNotifications.editableConfigurationKeys = Object.freeze([
      "url", "accessId", "serviceToken", "userId", "useHttps", "jQuery"
    ]);

    /**
     * Adds a function to the callbacks
     *
     * @function
     * @name BimaNotifications#addCallback
     * @param {function} fn - function to be added
     */
    BimaNotifications.prototype.addCallback = function (fn) {
      if (typeof(fn) === "function" && typeof(this.callbacks) === "object") {
        this.callbacks.push(fn);
      }
    };

    /**
     * Connect with the Websocket server under the specified address
     *
     * @function
     * @name BimaNotifications#connect
     */
    BimaNotifications.prototype.connect = function () {
      this._actionCableConsumer.connect;
      subscriptionManager.resubscribeToAllChannels();
    };

    /**
     * Disconnect from the websocket
     *
     * @function
     * @name BimaNotifications#disconnect
     */
    BimaNotifications.prototype.disconnect = function () {
      subscriptionManager.unsubscribeAllChannels();
      this._actionCableConsumer.disconnect();
    };

    /**
     * Returns the full URL to the WebSocket with the current configuration
     *
     * @function
     * @name BimaNotifications#fullSocketUrl
     * @return {string}
     */
    BimaNotifications.prototype.fullSocketUrl = function () {
      return this.configuration.fullSocketUrl;
    };

    /**
     * Mark a specific notification as read
     *
     * @function
     * @name BimaNotifications#markNotificationAsRead
     * @param {(string|number)} id - Id of the notification
     */
    BimaNotifications.prototype.markNotificationAsRead = function (id) {
      var subscription = subscriptionManager.subscriptions["UserNotificationsChannel"];

      subscription.perform("mark_notification_as_read", { notification_id: id });
    };

    // private

    function setActionCableConsumer () {
      try {
        var ActionCable = require("actioncable");

        this._actionCableConsumer = ActionCable.createConsumer(this.configuration.fullSocketUrl);
        this._actionCableConsumer.connect();
      }
      catch (err) {
        throw new Error(err);
      }
    };

    function setApiInstance () {
      var Api = require("./api.js");

      /**
       * Variable to access the notifications REST API instance
       *
       * @name BimaNotifications#Api
       * @type Api
       */
      this.Api = new Api(this);
    };

    function setFullSocketUrl () {
      var url = this.configuration.url;
      var accessId = this.configuration.accessId;
      var serviceToken = this.configuration.serviceToken;

      if (url && accessId && serviceToken) {
        var socketUrl = "ws://" + url + "/socket";

        if(socketUrl.match(/^ws:\/\/\w+(\.\w+)*(:[0-9]+)?\/?(\/[.\w]*)*[^\/]$/)) {
          this.configuration.fullSocketUrl = socketUrl;
          this.configuration.fullSocketUrl += "?access_id=" + accessId;
          this.configuration.fullSocketUrl += "&service_token=" + serviceToken;
          this.configuration.fullSocketUrl = encodeURI(this.configuration.fullSocketUrl);
        }
        else {
          throw new Error("options.socketUrl has invalid format");
        }
      }
      else {
        throw new Error("Required option properties are missing");
      }
    };

    function setSubscriptionManagerInstance ()  {
      var SubscriptionManager = require("./subscription_manager.js");
      subscriptionManager = new SubscriptionManager(this);
    };

    function setFinalConfiguration () {
      this.configuration = Object.freeze(this.configuration);
    };

    return BimaNotifications;
  })();

  // In Node.JS based envs
  if ((typeof(process) !== "undefined")) {
   module.exports = BimaNotifications;
  }
}(window));
