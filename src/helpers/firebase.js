// Firebase App (the core Firebase SDK) is always required and must be listed first
import * as firebase from 'firebase/app';
import 'firebase/auth';
import "firebase/firestore";
import 'firebase/performance';
import settings from './settings';

// Initialize Firebase
firebase.initializeApp(settings.credentials.firebase);
firebase.auth().useDeviceLanguage();

// eslint-disable-next-line no-unused-vars
const performance = firebase.performance();

function getFirestore() {
    return firebase.firestore();
}

function getFirebase() {
    return firebase;
}

export { getFirebase, getFirestore }