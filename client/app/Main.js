import React, { useReducer } from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
// Context module
import StateContext from './StateContext'
import DispatchContext from './DispatchContext'

import Header from './components/Header'
import HomeGuest from './components/HomeGuest'
import Footer from './components/Footer'
import About from './components/About'
import Terms from './components/Terms'
import Home from './components/Home'
import CreatePost from './components/CreatePost'
import FlashMessages from './components/FlashMessages'
import axios from 'axios'
import ViewSinglePost from './components/ViewSinglePost'
axios.defaults.baseURL = 'http://localhost:8080/'

const Main = () => {
  const intitalState = {
    loggedIn: Boolean(localStorage.getItem('complexappToken')),
    flashMessages: [],
  }

  const ourReducer = (state, action) => {
    switch (action.type) {
      case 'login':
        return { loggedIn: true, flashMessages: state.flashMessages }
      case 'logout':
        return { loggedIn: false, flashMessages: state.flashMessages }
      case 'flashMessage':
        return {
          loggedIn: state.loggedIn,
          flashMessages: state.flashMessages.concat(action.value),
        }
    }
  }

  const [state, dispatch] = useReducer(ourReducer, intitalState)

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        <BrowserRouter>
          <FlashMessages messages={state.flashMessages} />
          <Header />
          <Switch>
            <Route path="/" exact>
              {state.loggedIn ? <Home /> : <HomeGuest />}
            </Route>
            <Route path="/post/:id">
              <ViewSinglePost />
            </Route>
            <Route path="/about-us">
              <About />
            </Route>
            <Route path="/create-post" exact>
              <CreatePost />
            </Route>
            <Route path="/terms">
              <Terms />
            </Route>
          </Switch>
          <Footer />
        </BrowserRouter>
      </DispatchContext.Provider>
    </StateContext.Provider>
  )
}

ReactDOM.render(<Main />, document.getElementById('app'))

// This is for auto reload without refresing
if (module.hot) {
  module.hot.accept()
}
