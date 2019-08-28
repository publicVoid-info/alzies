import React from 'react'
import ReactDOM from 'react-dom'
import FindUsersDialog from './FindUsersDialog'

it('renders without crashing', () => {
    const div = document.createElement('div')
    ReactDOM.render(<FindUsersDialog />
        , div)
})