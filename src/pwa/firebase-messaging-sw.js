// import firebase scripts inside service worker js script
importScripts('https://www.gstatic.com/firebasejs/7.2.4/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/7.2.4/firebase-messaging.js');

firebase.initializeApp({
    'messagingSenderId': '222388203182'
});

export const messaging = firebase.messaging();