// firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/10.6.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.6.0/firebase-messaging-compat.js');

firebase.initializeApp({
    apiKey: 'AIzaSyAMec3qntywWcXqXj-O3sIrT5OiDNRsfUg',
    authDomain: 'the-thetaapp.firebaseapp.com',
    projectId: 'the-thetaapp',
    storageBucket: 'the-thetaapp.appspot.com',
    messagingSenderId: '917638422527',
    appId: '1:917638422527:web:cd08747ca0db6bfe7b11ca',
    measurementId: 'G-23R8MDEZT7',
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message:', payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/assets/icons/icon-72x72.png',
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
