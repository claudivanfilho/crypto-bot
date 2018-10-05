import './styles.css'
import './tachyons.css'
import './semantic.min.css'

import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Route, Switch } from 'react-router-dom'

import App from './components/App'
import Login from './components/Login'
import NotFound from './components/NotFound'
import registerServiceWorker from './registerServiceWorker'
import { UserProvider } from './contexts/userContext'

ReactDOM.render(
  <BrowserRouter>
    <UserProvider>
      <Switch>
        <Route exact path="/" component={App} />
        <Route path="/login" component={Login} />
        <Route component={NotFound} />
      </Switch>
    </UserProvider>
  </BrowserRouter>,
  document.getElementById('root')
)
registerServiceWorker()
