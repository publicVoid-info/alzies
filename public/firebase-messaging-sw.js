/* eslint-disable no-undef */
importScripts('https://www.gstatic.com/firebasejs/6.5.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/6.5.0/firebase-messaging.js');

firebase.initializeApp({ messagingSenderId: "222388203182" });

const messaging = firebase.messaging();

messaging.getToken()
    .then((currentToken) => {

    })
    .catch((err) => {
        console.log(err);
    });

messaging.setBackgroundMessageHandler((payload) => {
    const title = payload.title;
    const options = {
        body: payload.data.status
    }

    // eslint-disable-next-line no-restricted-globals
    return self.registration.showNotification(title, options);
});

