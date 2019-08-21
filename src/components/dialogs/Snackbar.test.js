import React from 'react'
import ReactDOM from 'react-dom'
import Snackbar from './Snackbar'

it('renders without crashing', () => {
    const div = document.createElement('div')
    ReactDOM.render(<Snackbar />
        , div)
})