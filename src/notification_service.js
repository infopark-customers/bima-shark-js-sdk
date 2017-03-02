/** @global **/
(function (global) {
  "use strict";

  /**
   * @class NotificationService
   * @classdesc Class to manage and receive notifications in BImA applications
   *
   * @param {Object} options - object hash with the settings
   * IMPORTANT: Please use here without any protocol and extra paths! (Example:
   * localhost:5000)
   * @param {string} options.accessId - App access ID for the BImA
   * notification service
   * @param {string} options.serviceToken - Service Token for BImA Doorkeeper
   * app to access the API
   * @param {string} options.userId - User ID related with the given serviceToken
   * @param {Object} options.jQuery - jQuery object with .ajax function
   * [default: jQuery | window.jQuery]
   * @param {string} options.apiEndpoint - URL to the API endpoint of the
   * Notification service
   * @param {string} options.webSocketUrl - URL to the WebSocket of the
   * Notification service
   * @param {(function|Object[])} options.callbacks - function or
   * array of functions which should be executed when a notification was
   * received
   * @throws An error if any if the required option properties is missing or
   * has a wrong format
   */
  global.NotificationService = (function () {
    /** @private **/
    var subscriptionManager = null;

    /** * @construtor */
    function NotificationService (options) {
      options = options || {};

      this.configuration = {};

      this.configuration.accessId = options.accessId;
      this.configuration.serviceToken = options.serviceToken;
      this.configuration.userId = options.userId;
      this.configuration.apiEndpoint = options.apiEndpoint;
      this.configuration.webSocketUrl = options.webSocketUrl;
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
     * @name NotificationService.channelNames
     * @type Array
     * @readonly
     */
    NotificationService.channelNames = Object.freeze([
      "GlobalNotificationsChannel",
      "UserNotificationsChannel"
    ]);

    /**
     * Keys for configuration which are editable
     *
     * @name NotificationService.editableConfigurationKeys
     * @type Array
     * @readonly
     */
    NotificationService.editableConfigurationKeys = Object.freeze([
       "accessId", "serviceToken", "userId", "apiEndpoint", "webSocketUrl", "jQuery"
    ]);

    /**
     * Adds a function to the callbacks
     *
     * @function
     * @name NotificationService#addCallback
     * @param {function} fn - function to be added
     */
    NotificationService.prototype.addCallback = function (fn) {
      if (typeof(fn) === "function" && typeof(this.callbacks) === "object") {
        this.callbacks.push(fn);
      }
    };

    /**
     * Connect with the Websocket server under the specified address
     *
     * @function
     * @name NotificationService#connect
     */
    NotificationService.prototype.connect = function () {
      this._actionCableConsumer.connect;
      subscriptionManager.resubscribeToAllChannels();
    };

    /**
     * Disconnect from the websocket
     *
     * @function
     * @name NotificationService#disconnect
     */
    NotificationService.prototype.disconnect = function () {
      subscriptionManager.unsubscribeAllChannels();
      this._actionCableConsumer.disconnect();
    };

    /**
     * Returns the full URL to the WebSocket with the current configuration
     *
     * @function
     * @name NotificationService#fullSocketUrl
     * @return {string}
     */
    NotificationService.prototype.fullSocketUrl = function () {
      return this.configuration.fullSocketUrl;
    };

    /**
     * Mark a specific notification as read
     *
     * @function
     * @name NotificationService#markNotificationAsRead
     * @param {(string|number)} id - Id of the notification
     */
    NotificationService.prototype.markNotificationAsRead = function (id) {
      var subscription = subscriptionManager.subscriptions["UserNotificationsChannel"];

      subscription.perform("mark_notification_as_read", { notification_id: id });
    };

    NotificationService.prototype.updateConfiguration = function (options) {
      options = options || {};
      var keys = Object.keys(options);

      if (keys.length > 0) {
        var jQuery = this.configuration.jQuery;
        var currentUserId = this.configuration.userId;
        var newConfiguration = jQuery.extend(true, {}, this.configuration);

        for (var i in keys) {
          var key = keys[i];

          if (jQuery.inArray(key, NotificationService.editableConfigurationKeys) > -1) {
            newConfiguration[key] = options[key];
          }
          else {
            throw new Error("Unallowed configuration key `" + key + "`");
          }
        }

        if (currentUserId !== newConfiguration.userId) {
          this.subscriptionsInitialized = false;
          this.subscriptionsInitializationsCount = 0;
        }

        this.configuration = newConfiguration;
        this.disconnect();

        setFullSocketUrl.call(this);
        setFinalConfiguration.call(this);
        setActionCableConsumer.call(this);
        setSubscriptionManagerInstance.call(this);
        setApiInstance.call(this);
      }
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
       * @name NotificationService#Api
       * @type Api
       */
      this.Api = new Api(this);
    };

    function setFullSocketUrl () {
      var webSocketUrl = this.configuration.webSocketUrl;
      var accessId = this.configuration.accessId;
      var serviceToken = this.configuration.serviceToken;

      if (webSocketUrl && accessId && serviceToken) {
        if(webSocketUrl.match(/^ws:\/\/\w+(\.\w+)*(:[0-9]+)?\/?(\/[.\w]*)*[^\/]$/) || webSocketUrl.match(/^wss:\/\/\w+(\.\w+)*(:[0-9]+)?\/?(\/[.\w]*)*[^\/]$/)) {
          this.configuration.fullSocketUrl = webSocketUrl;
          this.configuration.fullSocketUrl += "?access_id=" + accessId;
          this.configuration.fullSocketUrl += "&service_token=" + serviceToken;
          this.configuration.fullSocketUrl = encodeURI(this.configuration.fullSocketUrl);
        }
        else {
          throw new Error("options.webSocketUrl has invalid format");
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

    return NotificationService;
  })();

  // In Node.JS based envs
  if ((typeof(process) !== "undefined")) {
   module.exports = NotificationService;
  }
}(window));
