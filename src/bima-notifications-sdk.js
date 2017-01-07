(function (global) {
  "use strict";

  /*
   * @class
   */
  global.BimaNotifications = (function () {
    /*
     * Is the global object class for managing notifications in BImA
     * applications
     *
     * @construtor
     * @param {Object{}} options - object hash with the settings
     * @param {string} options.url - Basic URL to the API endpoint of the
     * Notification service
     * IMPORTANT: Please use here without any protocol and extra paths
     * @param {string} options.accessId - App access ID for the BImA
     * notification service
     * @param {string} options.serviceToken - Service Token for BImA Doorkeeper
     * app to access the API
     * @param {string} options.userId - User ID related with the given serviceToken
     * @param {boolean} options.useHttps - Set true if API endpoint should be
     * called with https [default: true]
     * @param {Object[function ...]|function} options.callbacks - function or
     * array of functions which should be executed when a notification was
     * received
     */
    function BimaNotifications (options) {
      options = options || {};

      this.url = options.url;
      this.accessId = options.accessId;
      this.serviceToken = options.serviceToken;
      this.userId = options.userId;
      this.useHttps = options.useHttps;

      if (typeof(this.useHttps) === "undefined") this.useHttps = true;

      var callbacks = options.callbacks;

      if (typeof(callbacks) !== "undefined" && typeof(callbacks) === "function") {
        this.callbacks = [callbacks];
      }
      else if (typeof(callbacks) === "object") {
        this.callbacks = callbacks;
      }
      else {
        this.callbacks = [];
      }

      this.jQuery = options.jQuery || jQuery || window.jQuery || $;
      this.subscriptionsInitialized = false;
      this.subscriptionsInitializationsCount = 0;

      createFullSocketUrl.call(this);
      createActionCableConsumer.call(this);
      createSubscriptionManagerInstance.call(this);
      createApiInstance.call(this);
    };

    /*
     * Names of the notification channels
     *
     * @function
     * @name channelNames
     * @access public
     * @return {Array} - frozen array with the channel names
     */
    BimaNotifications.channelNames = function () {
      return Object.freeze([
        "GlobalNotificationsChannel",
        "UserNotificationsChannel"
      ]);
    };

    /*
     * Adds a function to the callbacks
     *
     * @function
     * @name addCallback
     * @access public
     * @param {function} fn - function to be added
     */
    BimaNotifications.prototype.addCallback = function (fn) {
      if (typeof(fn) === "function" && typeof(this.callbacks) === "object") {
        this.callbacks.push(fn);
      }
    };

    /*
     * Connect with the Websocket server under the specified address
     *
     * @function
     * @name connect
     * @access public
     */
    BimaNotifications.prototype.connect = function () {
      this.actionCableConsumer.connect;
      this.subscriptionManager.resubscribeToAllChannels();
    };

    /*
     * Disconnect from the websocket
     *
     * @function
     * @name disconnect
     * @access public
     */
    BimaNotifications.prototype.disconnect = function () {
      this.subscriptionManager.unsubscribeAllChannels();
      this.actionCableConsumer.disconnect();
    };

    /*
     * Mark a specific notification as read
     *
     * @function
     * @name markNotificationAsRead
     * @access public
     * @param {string|number} id - Id of the notification
     */
    BimaNotifications.prototype.markNotificationAsRead = function (id) {
      var subscription = this.subscriptionManager.subscriptions["UserNotificationsChannel"];

      subscription.perform("mark_notification_as_read", { notification_id: id });
    };

    // private

    function createActionCableConsumer () {
      try {
        var ActionCable = require("actioncable");

        this.actionCableConsumer = ActionCable.createConsumer(this.fullSocketUrl);
        this.connection = this.actionCableConsumer.connection;
        this.actionCableConsumer.connect();
      }
      catch (err) {
        throw new Error(err);
      }
    };

    function createApiInstance () {
      var Api = require("./api.js");
      this.Api = new Api(this);
    };

    function createFullSocketUrl () {
      const url = this.url;
      const accessId = this.accessId;
      const serviceToken = this.serviceToken;

      if (url && accessId && serviceToken) {
        var socketUrl = "ws://" + url + "/socket";

        if(socketUrl.match(/^ws:\/\/\w+(\.\w+)*(:[0-9]+)?\/?(\/[.\w]*)*[^\/]$/)) {
          this.fullSocketUrl = socketUrl;
          this.fullSocketUrl += "?access_id=" + accessId;
          this.fullSocketUrl += "&service_token=" + serviceToken;
          this.fullSocketUrl = encodeURI(this.fullSocketUrl);
        }
        else {
          throw new Error("options.socketUrl has invalid format");
        }
      }
      else {
        throw new Error("Required option parameters are missing");
      }
    };

    function createSubscriptionManagerInstance ()  {
      var SubscriptionManager = require("./subscription_manager.js");
      this.subscriptionManager = new SubscriptionManager(this);
    };

    return BimaNotifications;
  })();

  // In Node.JS based envs
  if ((typeof(process) !== "undefined")) {
   module.exports = BimaNotifications;
  }
}(window));
