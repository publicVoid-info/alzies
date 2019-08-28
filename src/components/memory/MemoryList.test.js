import React from 'react';
import ReactDOM from 'react-dom';
import MemoryList from './MemoryList';
import { BrowserRouter as Router } from 'react-router-dom';

xit('renders without crashing', () => {
    const div = document.createElement('div');

    global.MutationObserver = class {
        constructor(callback) { }
        disconnect() { }
        observe(element, initObject) { }
        takeRecords() { return [] }
    };

    const memoryList = [{
        id: '123',
        headline: 'opa',
        context: 'opa',
        owner: ['123']
    }]

    ReactDOM.render(
        <Router>
            <MemoryList memoryList={memoryList} />
        </Router>, div);

    ReactDOM.unmountComponentAtNode(div);
})