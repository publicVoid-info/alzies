import React from 'react'

import Header from './Header'

export default function Welcome(props) {

    return (
        <React.Fragment>
            <nav >
                <Header history={props.history}/>
            </nav>
            <main>

            </main>
        </React.Fragment>
    )
}