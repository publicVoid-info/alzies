// Firebase App (the core Firebase SDK) is always required and must be listed first
import * as firebase from "firebase/app"

// Add the Firebase products that you want to use
import "firebase/auth"
import "firebase/firestore"

// Initialize Firebase
firebase.initializeApp({
    apiKey: "AIzaSyCXeCcCZut2IxWbpZbc3VIYk75Ls2J8rjI",
    authDomain: "alzies.firebaseapp.com",
    databaseURL: "https://alzies.firebaseio.com",
    projectId: "alzies",
    storageBucket: "alzies.appspot.com",
    messagingSenderId: "222388203182",
    appId: "1:222388203182:web:85fc1fc80394d0d6"
})

const db = firebase.firestore()

function getFirebase() {
    return db
}

export { getFirebase }




