import React from 'react'
import ReactDOM, { render } from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App'
import * as serviceWorker from './serviceWorker'
import 'bootstrap/dist/css/bootstrap.css'

render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById('root'))
serviceWorker.unregister()
