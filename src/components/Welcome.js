import React, { useEffect } from 'react'
import { makeStyles } from '@material-ui/styles'
import { GoogleAuth, getFirebaseAuth } from '../firebaseManager'
import SignInManager from '../signInManager'

import Header from './Header'
import Button from '@material-ui/core/Button'
import Container from '@material-ui/core/Container'

const useStyles = makeStyles(theme => ({
    button: {
        marginTop: '33vh',
        margin: 'auto',
        width: '36vw',
        height: '8vh',
        fontSize: '1.2em',
    },
    container: {
        textAlign: 'center',
    },
}));

const googleAuth = new GoogleAuth()
const signInState = new SignInManager()

export default function Welcome(props) {

    const classes = useStyles()
    const currentUser = getFirebaseAuth().currentUser

    useEffect(() => {

        if (currentUser) { props.history.push('/home') }

    }, [currentUser, props.history])

    const handleSignIn = () => {

        signInState.start()

        googleAuth.signIn()

    }

    return (
        <React.Fragment>
            <nav >
                <Header />
            </nav>
            <main>
                <Container className={classes.container} maxWidth="xl">
                    <Button
                        className={classes.button}
                        variant="contained"
                        color="secondary"
                        size="large"
                        onClick={handleSignIn}
                        disabled={(signInState.getSignInState().request)}>
                        Sign In
                    </Button>
                </Container>
            </main>
        </React.Fragment>
    )
}