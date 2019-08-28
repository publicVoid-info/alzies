import React from 'react'
import ReactDOM from 'react-dom'
import Editor from './Editor'

xit('renders without crashing', () => {
    const div = document.createElement('div')

    ReactDOM.render(<Editor
        theme="snow"
        height="75vh"
        onChange={() => { return null }}
        text={"texto"}
        readOnly={false} />, div)
})