$(document).ready(function () {
  var notificationStore = [];

  var onNotificationChange = function (response) {
    if (response && typeof(response.action) !== "undefined") {
      var action = response.action;

      switch (action) {
        case "notification_new":
          addNewNotificationToStore(response.data);
          break;
        case "notification_read":
          deleteNotificationFromStore(response.data);
          break;
        case "subscriptions_initialized":
          fetchAllUnreadNotificationsAfterInit();
          break;
      }
    }
  };

  var addNewNotificationToStore = function (data) {
    notificationStore.unshift(data);

    renderNotifications();
  };

  var deleteNotificationFromStore = function (data) {
    var id = data.notification.id;
    var appAccessId = data.app.access_id;

    if (appAccessId === window.notificationServiceInstance.configuration.accessId) {
      var elementIndex = null;

      for (var i = 0; i < notificationStore.length; i++) {
        var element = notificationStore[i];
        if (element.id === id) {
          elementIndex = i;
          break;
        }
      }

      if (elementIndex !== null) notificationStore.splice(elementIndex, 1);

      renderNotifications();
    }
  };

  var fetchAllUnreadNotificationsAfterInit = function () {
    var notificationServiceInstance = window.notificationServiceInstance;

    if (notificationServiceInstance.subscriptionsInitialized && notificationServiceInstance.subscriptionsInitializationsCount === 1) {
      window.notificationServiceInstance.Api.unreadUserNotifications()
        .done(function (notifications) {
          setInitialNotificationStore(notifications);
        })
        .fail(function (response) {
          console.log("Couldn't get all unread notifications");
          console.log(response.status);
        });
    }
  };

  var setInitialNotificationStore = function (notifications) {
    notifications = notifications || [];
    notificationStore = notifications;

    renderNotifications();
  };

  var renderNotifications = function () {
    $("ul#notifications").empty();

    notificationStore.forEach(function (notification) {
      var htmlElement = '<li class="notification" data-notification-id="' + notification.id + '">';
      htmlElement += notification.message + '<br><hr>';
      htmlElement += '<small>ID: ' + notification.id + '; </small>';
      htmlElement += '<small>Context: ' + notification.context + '</small>';
      htmlElement += '</li>';

      $("ul#notifications").append(htmlElement);
    });

    $("li.notification").click(function () {
      var id = this.dataset.notificationId;
      window.notificationServiceInstance.markNotificationAsRead(id);
    });
  };

  window.notificationServiceInstance = new NotificationService({
    accessId: window.sessionConfig.accessId,
    userId: window.sessionConfig.userId,
    serviceToken: window.sessionConfig.serviceToken,
    apiEndpoint: window.sessionConfig.apiEndpoint, // http://localhost:3004/api/v1
    webSocketUrl: window.sessionConfig.webSocketUrl, // http://localhost:3004/socket
    callbacks: [onNotificationChange]
  });
});
