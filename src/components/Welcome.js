import React, { useState } from 'react'
import { GoogleAuth } from '../firebaseManager'

import Header from './Header'

export default function Welcome(props) {

    const googleAuth = new GoogleAuth()

    const [auth, setAuth] = useState(null)

    const handleSignIn = () => {

        googleAuth.signIn()

    }

    const handleSignOut = () => {

        googleAuth.signOut()

    }

    const handleRedirect = () => {

        googleAuth.getRedirectResult()
        setAuth(googleAuth.getAuth())
    }



    return (
        <React.Fragment>
            <nav >
                <Header />
            </nav>
            <main>
                <button onClick={handleSignIn}>Sign In</button>
                <button onClick={handleRedirect}>Get Redirect</button>
                <button onClick={handleSignOut}>Sign Out</button>

                <div>
                    User Info
                    {auth}


                </div>

            </main>
        </React.Fragment>
    );
}



