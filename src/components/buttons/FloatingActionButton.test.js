import React from 'react'
import ReactDOM from 'react-dom'
import FloatingActionButton from './FloatingActionButton'
import { jest } from ''

it('renders without crashing', () => {
    const div = document.createElement('div')
    ReactDOM.render(
        <FloatingActionButton onClick={() => 'oi'}>
            <div />
        </FloatingActionButton>

        , div)
})
