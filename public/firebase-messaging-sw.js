importScripts(
  "https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js"
);

firebase.initializeApp({
  apiKey: "AIzaSyD1ddzjJwft7D40M4kKN1iaQn698R96AZ0",
  authDomain: "rigrescue-b18c8.firebaseapp.com",
  projectId: "rigrescue-b18c8",
  storageBucket: "rigrescue-b18c8.firebasestorage.app",
  messagingSenderId: "641036335570",
  appId: "1:641036335570:web:d2ba754ed479399163700b",
  measurementId: "G-WB7EWWZB1C",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  console.log("Received background message: ", payload);

  const { title, body } = payload.notification;

  self.registration.showNotification(title, {
    body,
    icon: "/logo.png",
  });
});
