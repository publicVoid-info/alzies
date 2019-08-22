import React from 'react'
import ReactDOM from 'react-dom'
import MemoryCard from './MemoryCard'

xit('renders without crashing', () => {
    const div = document.createElement('div')
    const m = {
        id: '123',
        headline: '',
        content: '',
        owner: [''],
    }
    ReactDOM.render(<MemoryCard key={m.id} memory={m} />, div)
})