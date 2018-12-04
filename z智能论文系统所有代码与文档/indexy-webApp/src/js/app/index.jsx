import React, { Component } from 'react'
import { render } from 'react-dom'
import routes from './routes'
import stores from './stores'
import { BrowserRouter, HashRouter } from 'react-router-dom'
import { Provider } from 'mobx-react'
import 'antd-mobile/dist/antd-mobile.css'

function App() {
  return (
    <HashRouter>
      <Provider {...stores}>
        {routes}
      </Provider>
    </HashRouter>
  )
}

const container = document.getElementById('container');
render(
  <App />,
  container
)

if (module.hot) {
  module.hot.accept('./routes', () => {
    render(
      <App />,
      container
    )
  });
}
