import React from 'react'
import ReactDOM from 'react-dom'
import DeleteCardDialog from './DeleteCardDialog'

it('renders without crashing', () => {
    const div = document.createElement('div')
    ReactDOM.render(<DeleteCardDialog />
        , div)
})