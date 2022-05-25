import {Component} from 'react'
import {Route, Switch, Redirect} from 'react-router-dom'

import './App.css'

import LoginForm from './components/LoginForm'
import Home from './components/Home'
import NotFound from './components/NotFound'
import Bookshelves from './components/Bookshelves'
import BookDetails from './components/BookDetails'
import ProtectedRoute from './components/ProtectedRoute'
import Header from './components/Header'

class App extends Component {
  render() {
    return (
      <div className="app-container">
        <Switch>
          <Route exact path="/login" component={LoginForm} />
          <Route exact path="/header" component={Header} />
          <ProtectedRoute exact path="/" component={Home} />
          <ProtectedRoute exact path="/shelf" component={Bookshelves} />
          <ProtectedRoute exact path="/books/:id" component={BookDetails} />
          <Route exact path="/bad-path" component={NotFound} />
          <Route path="/not-found" component={NotFound} />
          <Redirect to="not-found" />
        </Switch>
      </div>
    )
  }
}

export default App
