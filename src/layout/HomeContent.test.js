import React from 'react';
import ReactDOM from 'react-dom';
import { MemoryRouter } from 'react-router-dom';
import HomeContent from './HomeContent';
import { Provider } from 'react-redux';
import store from '../store/reducers';

it('renders without crashing', () => {
  const div = document.createElement('div');

  ReactDOM.render(
    (
      <Provider store={store}>
        <MemoryRouter>
          <HomeContent />
        </MemoryRouter>
      </Provider>
    ),
    div
  );

  ReactDOM.unmountComponentAtNode(div);
});
