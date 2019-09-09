import React from 'react';
import ReactDOM from 'react-dom';
import SignUpDialog from './SignUpDialog';
import { Provider } from 'react-redux';
import store from '../store/reducers';

it('renders without crashing', () => {
  const div = document.createElement('div');

  ReactDOM.render(
    (
      <Provider store={store}>
        <SignUpDialog />
      </Provider>
    ),
    div
  );

  ReactDOM.unmountComponentAtNode(div);
});
