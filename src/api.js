"use strict";

/**
 * @class Api
 * @classdesc Management class to access the notifications REST API
 * @private
 * @param {NotificationService} instance - Instance of NotificationService
 * @throws Will throw an error if instance.configuration.jQuery is invalid,
 * null or does not have an .ajax function
 */
var Api = (function () {
  /** @construtor **/
  function Api (instance) {
    /**
     * @name Api#instance
     * @type NotificationService
     */
    this.instance = instance || {};

    var jQuery = this.instance.configuration.jQuery;

    if (typeof(jQuery) === "undefined" || typeof(jQuery.ajax) !== "function") {
      var error = "jQuery and jQuery.ajax are required to use the API";
      throw new Error(error);
    }
  };

  /**
   * API call to find a specific notification
   *
   * @function
   * @name Api#findNotification
   * @param {Number|String} id - ID of the notification to be found
   * @param {Object} ajaxOptions - extra options hash for jQuery.ajax
   * @return {Promise} jQuery AJAX promise
   * @see {@link http://api.jquery.com/jquery.ajax/}
   */
  Api.prototype.findNotification = function (id, ajaxOptions) {
    ajaxOptions = ajaxOptions || {};

    var reqUrl = this.url() + "/notifications/" + id + ".json";
    var data = {
      access_id: this.instance.configuration.accessId,
      service_token: this.instance.configuration.serviceToken
    };
    var options = { url: reqUrl, data: data, type: "GET" };

    return this.jQuery().ajax(this.jQuery().extend(ajaxOptions, options));
  };

  /**
   * API call to get all unread notifications for the given user
   *
   * @function
   * @name Api#unreadUserNotifications
   * @param {Date} since - Date since when notifications should be fetched
   * [default: 7 days ago]
   * @param {Object} ajaxOptions - extra options hash for jQuery.ajax
   * @return {Promise} jQuery AJAX promise
   * @see {@link http://api.jquery.com/jquery.ajax/}
   */
  Api.prototype.unreadUserNotifications = function (since, ajaxOptions) {
    ajaxOptions = ajaxOptions || {};

    var userId = this.instance.configurationuserId;
    var reqUrl = this.url() + "/users/" + userId + "/notifications/unread" + ".json";
    var data = {
      access_id: this.instance.configuration.accessId,
      service_token: this.instance.configuration.serviceToken
    };

    if (since) data["since"] = since;
    var options = { url: reqUrl, data: data, type: "GET" };

    return this.jQuery().ajax(this.jQuery().extend(ajaxOptions, options));
  };

  /**
   * API call to get all notifications for the given user
   *
   * @function
   * @name Api#userNotifications
   * @param {Date} since - Date since when notifications should be fetched
   * [default: 7 days ago]
   * @param {Object} ajaxOptions - extra options hash for jQuery.ajax
   * @return {Promise} jQuery AJAX promise
   * @see {@link http://api.jquery.com/jquery.ajax/}
   */
  Api.prototype.userNotifications = function (since, ajaxOptions) {
    ajaxOptions = ajaxOptions || {};

    var userId = this.instance.configuration.userId;
    var reqUrl = this.url() + "/users/" + userId + "/notifications" + ".json";
    var data = {
      access_id: this.instance.configuration.accessId,
      service_token: this.instance.configuration.serviceToken
    };

    if (since) data["since"] = since;
    var options = { url: reqUrl, data: data, type: "GET" };

    return this.jQuery().ajax(this.jQuery().extend(ajaxOptions, options));
  };

  /**
   * Getter for the jQuery object of this.instance.configuration
   *
   * @function
   * @name Api#jQuery
   * @return {Object} jQuery
   */
  Api.prototype.jQuery = function () {
    return this.instance.configuration.jQuery;
  };

  /**
   * URL to the HTTP(S) API endpoint
   *
   * @function
   * @name Api#url
   * @return String
   */
  Api.prototype.url = function () {
    var url = "";

    if (this.instance.configuration.useHttps === true) {
      url += "https://";
    }
    else {
      url += "http://";
    }

    // TODO: Make this version later dynamicly configureable
    url += this.instance.configuration.url + "/api/v1";
    return url;
  };

  return Api;
})();

module.exports = Api;
