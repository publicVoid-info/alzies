import React, { Component } from 'react'
import Header from './Header'

export default class NoMatch extends Component {
    render() {
        return (
            <nav >
                <Header />
                <main>
                    <h1>404</h1>
                </main>
            </nav>
        )
    }
}
