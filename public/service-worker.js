// service-worker.js
if( 'function' === typeof importScripts) {
  // eslint-disable no-undef 
  importScripts("https://js.pusher.com/beams/service-worker.js");
}

self.addEventListener("push", function (event) {
  const data = event.data.json();

  self.registration.showNotification(data.notification.title, {
      body: data.notification.body,
      icon: "/logo192.png", // Optional notification icon
      data: { url: data.notification.deep_link }, // Add the deep link to the notification
  });
});

self.addEventListener("notificationclick", function (event) {
  event.notification.close();
  event.waitUntil(clients.openWindow(event.notification.data.url));
});



self.addEventListener("notificationclick", function (event) {
    event.notification.close();
    event.waitUntil(clients.openWindow(event.notification.data.url));
});
















/*proper initialization
if( 'function' === typeof importScripts) {
  /* eslint-disable no-undef 
  importScripts("https://js.pusher.com/beams/service-worker.js");
}

PusherPushNotifications.onNotificationReceived = ({
  pushEvent,
  payload,
  handleNotification,
}) => {

  console.log("worker got : " + JSON.stringify(payload));

  // Get the client.
  self.clients.matchAll().then((matchedClient) => matchedClient.forEach(client => {
    client.postMessage(payload.data);
  }));

  // Your custom notification handling logic here 🛠️
  // This method triggers the default notification handling logic offered by
  // the Beams SDK. This gives you an opportunity to modify the payload.
  // E.g. payload.notification.title = "A client-determined title!"
  pushEvent.waitUntil(handleNotification(payload));
};
*/