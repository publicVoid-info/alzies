import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/performance';
import settings from './settings';

// Initialize Firebase
firebase.initializeApp(settings.credentials.firebase);
firebase.auth().useDeviceLanguage();

// eslint-disable-next-line no-unused-vars
const performance = firebase.performance();
performance.dataCollectionEnabled = true;
performance.instrumentationEnabled = true;

function getFirestore() {
    return firebase.firestore();
}

function getFirebase() {
    return firebase;
}

export { getFirebase, getFirestore }

// import 'firebase/messaging';

// const messaging = firebase.messaging();
// messaging.usePublicVapidKey('BNhGalLHbQMAbV_Lth6c0nGUzHcGVL5TV2ZUFtXZ1KdvC00Xlq4KJtb5USVqKwHZa1BiDM9nES5Y7rmEMXZiLfI');
// messaging.requestPermission()
//     .then(() => {
//         return messaging.getToken();
//     })
//     .then(currentToken => {
//         if (currentToken) {

//         } else {

//         }
//     })
//     .catch((err) => {
//         console.log(err);
//     });

// messaging.onTokenRefresh(() => {
//     messaging.getToken().then((refreshedToken) => {

//     }).catch((err) => {

//     });
// });

// messaging.onMessage((payload) => {
//     console.log(`On message:`);
//     console.table(payload);
// })