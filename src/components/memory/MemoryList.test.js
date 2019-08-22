import React from 'react'
import ReactDOM from 'react-dom'
import MemoryList from './MemoryList'

xit('renders without crashing', () => {
    const div = document.createElement('div')
    ReactDOM.render(<MemoryList />, div)
})