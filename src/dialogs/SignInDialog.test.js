import React from 'react';
import ReactDOM from 'react-dom';
import SignInDialog from './SignInDialog';
import { Provider } from 'react-redux';
import store from '../store/reducers';

it('renders without crashing', () => {
  const div = document.createElement('div');

  ReactDOM.render(
    (
      <Provider store={store}>
        <SignInDialog />
      </Provider>
    ),
    div
  );

  ReactDOM.unmountComponentAtNode(div);
});
