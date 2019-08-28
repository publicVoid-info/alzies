import React from 'react'
import ReactDOM from 'react-dom'
import MemoryEditor from './MemoryEditor'
import { BrowserRouter, Route } from 'react-router-dom'

it('renders without crashing', () => {
    const div = document.createElement('div')

    ReactDOM.render(< BrowserRouter >
        < Route exact path={`/memory/${123}`} component={MemoryEditor} />
    </BrowserRouter >, div);

    ReactDOM.unmountComponentAtNode(div);
})