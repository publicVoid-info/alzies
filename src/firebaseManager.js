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

firebase.auth().useDeviceLanguage()

const db = firebase.firestore()
// const auth = firebase.auth()
const googleAuthProvider = new firebase.auth.GoogleAuthProvider()


function getFirebase() {
    return db
}

class GoogleAuth {
    constructor() {
        this._auth = firebase.auth()
        this._provider = googleAuthProvider
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


function getFirebaseAuth() {
    // Initialize the FirebaseUI Widget using Firebase.
    // const ui = new firebaseui.auth.AuthUI(auth);

    // auth.onAuthStateChanged(function (user) {
    //     if (user) {
    //         console.log(user)
    //         // ...
    //     } else {
    //         // User is signed out.
    //         // ...
    //     }
    // })

    // ui.start('#firebaseui-auth-container', {
    //     signInOptions: [
    //         // List of OAuth providers supported.
    //         firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    //     ],
    //     // Other config options...
    // })

    // const uiConfig = {
    //     callbacks: {
    //         signInSuccessWithAuthResult: function (authResult, redirectUrl) {
    //             // User successfully signed in.
    //             // Return type determines whether we continue the redirect automatically
    //             // or whether we leave that to developer to handle.
    //             console.log(authResult)
    //             console.log(redirectUrl)
    //             return true;
    //         },
    //         uiShown: function () {
    //             // The widget is rendered.
    //             // Hide the loader.
    //             document.getElementById('loader').style.display = 'none';
    //         }
    //     },
    //     // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
    //     signInFlow: 'popup',
    //     signInSuccessUrl: '', //'https://alzies.herokuapp.com/',
    //     signInOptions: [
    //         // Leave the lines as is for the providers you want to offer your users.
    //         firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    //     ],
    //     // Terms of service url.
    //     tosUrl: '<your-tos-url>',
    //     // Privacy policy url.
    //     privacyPolicyUrl: '<your-privacy-policy-url>'
    // }

    // // The start method will wait until the DOM is loaded.
    // ui.start('#firebaseui-auth-container', uiConfig)

    // console.log(auth.currentUser)
}

export { getFirebase, getFirebaseAuth, GoogleAuth }




