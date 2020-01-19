import React from 'react'
import ReactDOM from 'react-dom'
import AuthProviderList from './AuthProviderList'
import { Provider } from 'react-redux'
import store from '../store/reducers'

it('renders without crashing', () => {
  const div = document.createElement('div')

  ReactDOM.render(
    <Provider store={store}>
      <AuthProviderList />
    </Provider>,
    div
  )

  ReactDOM.unmountComponentAtNode(div)
})
