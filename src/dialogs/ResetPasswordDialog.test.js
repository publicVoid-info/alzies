import React from 'react';
import ReactDOM from 'react-dom';
import ResetPasswordDialog from './ResetPasswordDialog';
import { Provider } from 'react-redux';
import store from '../store/reducers';

it('renders without crashing', () => {
  const div = document.createElement('div');

  ReactDOM.render(
    (
      <Provider store={store}>
        <ResetPasswordDialog />
      </Provider>
    ),
    div
  );

  ReactDOM.unmountComponentAtNode(div);
});
