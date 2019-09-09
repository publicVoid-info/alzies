import React from 'react';
import ReactDOM from 'react-dom';
import Drawer from './Drawer';
import { Provider } from 'react-redux';
import store from '../store/reducers';

it('renders without crashing', () => {
    const div = document.createElement('div');

    ReactDOM.render(
        (
            <Provider store={store}>
                <Drawer />
            </Provider>
        ),
        div
    );

    ReactDOM.unmountComponentAtNode(div);
});
