import React from 'react'
import ReactDOM from 'react-dom'
import Profile from './Profile'
import { Provider } from 'react-redux'
import store from '../store/reducers'

xit('renders without crashing', () => {
  const div = document.createElement('div')

  const user = {
    photoURL: '',
    displayName: '',
    email: ''
  }

  ReactDOM.render(
    <Provider store={store}>
      <Profile user={user} />
    </Provider>,
    div
  )

  ReactDOM.unmountComponentAtNode(div)
})
