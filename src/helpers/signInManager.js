export default class SignInManager {
    constructor() {
        this.signInDefault =
            {
                redirects: 0,
                request: false,
                complete: false,
            }

        this.initSignInState()

    }

    initSignInState = () => {

        const signProcess = JSON.parse(localStorage.getItem('signIn'))

        if (!signProcess) {
            localStorage.setItem('signIn', JSON.stringify(this.signInDefault))
        } else {
            if (!signProcess.complete && signProcess.getRedirects > 10) {
                localStorage.setItem('signIn', JSON.stringify(this.signInDefault))
            }
        }
    }

    getSignInState = () => {

        return JSON.parse(localStorage.getItem('signIn'))

    }

    start = () => {

        localStorage.setItem('signIn', JSON.stringify({
            request: true,
            complete: false,
            redirects: 0
        }))
    }

    reset = () => {

        localStorage.setItem('signIn', JSON.stringify({
            request: false,
            complete: false,
            redirects: 0
        }))
    }

    finish = () => {

        localStorage.setItem('signIn', JSON.stringify({
            request: false,
            complete: true,
            redirects: 0
        }))
    }

    logRedirect = () => {

        const signIn = JSON.parse(localStorage.getItem('signIn'))

        signIn.redirects = + 1

        localStorage.setItem('signIn', JSON.stringify(signIn))

    }

}

