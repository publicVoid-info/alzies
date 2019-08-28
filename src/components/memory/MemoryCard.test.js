import React from 'react';
import ReactDOM from 'react-dom';
import MemoryCard from './MemoryCard';
import { StaticRouter as Router } from 'react-router-dom';

xit('renders without crashing', () => {
    const div = document.createElement('div')
    const m = {
        id: '123',
        headline: '',
        content: '',
        owner: [''],
    }
    ReactDOM.render(
        <Router>
            <MemoryCard key={m.id} memory={m} />
        </Router>, div);

    ReactDOM.unmountComponentAtNode(div);
})