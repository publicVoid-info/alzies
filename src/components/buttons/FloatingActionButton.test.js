import React from 'react'
import ReactDOM from 'react-dom'
import FloatingActionButton from './FloatingActionButton'

it('renders without crashing', () => {
    const div = document.createElement('div')
    ReactDOM.render(
        <FloatingActionButton onClick={() => { alert('oi') }}>
            <div />
        </FloatingActionButton>

        , div)
})
