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
     * @param {string} options.socketUrl - URL for the TCP Websocket to connect
     * @param {string} options.accessId - App access ID for the BImA
     * notification service
     * @param {string} options.webSocketSecretKey - App websocket secret key for the BImA
     * notification service
     * @param {string} options.userId - User ID for the current app which is
     * using the notification service
     * @param {Object[function ...]|function} options.callbacks - function or
     * array of functions which should be executed when a notification was
     * received
     */
    function BimaNotifications (options) {
      options = options || {};

      this.socketUrl = options.socketUrl;
      this.accessId = options.accessId;
      this.webSocketSecretKey = options.webSocketSecretKey;
      this.userId = options.userId;

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

      createFullSocketUrl.call(this);
      createActionCableConsumer.call(this);
      createSubscriptionManager.call(this);
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

      // subscription.perform("mark_notification_as_read", { notificationId: id });
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

    function createFullSocketUrl () {
      const socketUrl = this.socketUrl;
      const accessId = this.accessId;
      const webSocketSecretKey = this.webSocketSecretKey;
      const userId = this.userId;

      if (socketUrl && accessId && webSocketSecretKey && userId) {
        if(socketUrl.match(/^ws:\/\/\w+(\.\w+)*(:[0-9]+)?\/?(\/[.\w]*)*[^\/]$/)) {
          this.fullSocketUrl = socketUrl;
          this.fullSocketUrl += "?access_id=" + accessId;
          this.fullSocketUrl += "&web_socket_secret_key=" + webSocketSecretKey;
          this.fullSocketUrl += "&user_id=" + userId;
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

    function createSubscriptionManager ()  {
      var SubscriptionManager = require("./subscription_manager.js");
      this.subscriptionManager = new SubscriptionManager(this);
    };

    return BimaNotifications;
  })();

  if ((typeof(process) !== "undefined")) {
   module.exports = BimaNotifications;
  }
}(window));
