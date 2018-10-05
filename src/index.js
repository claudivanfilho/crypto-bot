import './styles.css'
import './tachyons.css'
import './semantic.min.css'

import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Route } from 'react-router-dom'

import App from './components/App'
import Login from './components/Login'
import registerServiceWorker from './registerServiceWorker'
import { UserProvider } from './contexts/userContext'

ReactDOM.render(
  <BrowserRouter>
    <UserProvider>
      <Route exact path="/" component={App} />
      <Route path="/auth/login" component={Login} />
    </UserProvider>
  </BrowserRouter>,
  document.getElementById('root')
)
registerServiceWorker()
