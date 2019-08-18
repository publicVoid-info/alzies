// Firebase App (the core Firebase SDK) is always required and must be listed first
import * as firebase from "firebase/app"
//import * as firebaseui from 'firebaseui'

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

function getFirestore() {
    return firebase.firestore()
}

function getFirebaseAuth() {
    return firebase.auth()
}

class GoogleAuth {
    constructor() {
        this._auth = firebase.auth()
        this._auth.useDeviceLanguage()
        this._provider = new firebase.auth.GoogleAuthProvider()
    }

    getAuth(json = false) {
        return (
            (json)
                ?
                JSON.stringify(this._auth)
                :
                this._auth
        )
    }

    getCurrentUser() {
        return this._auth.currentUser
    }

    registerCurrentUser() {

        if (!this._auth.currentUser) { return }

        const user = {
            uid: this._auth.currentUser.uid,
            displayName: this._auth.currentUser.displayName,
            email: this._auth.currentUser.email,
        }

        return getFirestore().collection('users').doc(this._auth.currentUser.uid).set(user)
    }

    signIn() {
        this._auth.signInWithRedirect(this._provider)
    }

    signOut() {
        return this._auth.signOut()
    }

    getRedirectResult() {
        this._auth.getRedirectResult()
    }
}

export { getFirestore, getFirebaseAuth, GoogleAuth }




