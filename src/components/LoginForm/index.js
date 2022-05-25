import {Component} from 'react'
import Cookies from 'js-cookie'
import {Redirect} from 'react-router-dom'

import './index.css'

class LoginForm extends Component {
  state = {
    username: '',
    password: '',
    showSubmitError: false,
    errorMsg: '',
  }

  onChangeUsername = event => {
    this.setState({username: event.target.value})
  }

  onChangePassword = event => {
    this.setState({password: event.target.value})
  }

  onSubmitSuccess = jwtToken => {
    const {history} = this.props

    Cookies.set('jwt_token', jwtToken, {
      expires: 30,
      path: '/',
    })
    history.replace('/')
  }

  onSubmitFailure = errorMsg => {
    this.setState({showSubmitError: true, errorMsg})
  }

  submitForm = async event => {
    event.preventDefault()
    const {username, password} = this.state
    const userDetails = {username, password}
    const url = 'https://apis.ccbp.in/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    try {
      const response = await fetch(url, options)
      const data = await response.json()
      if (response.ok === true) {
        this.onSubmitSuccess(data.jwt_token)
      } else {
        this.onSubmitFailure(data.error_msg)
      }
    } catch (error) {
      this.onSubmitFailure(error)
    }
  }

  renderPasswordField = () => {
    const {password} = this.state
    return (
      <div>
        <label className="input-label" htmlFor="password">
          Password*
        </label>
        <div className="input-container">
          <input
            type="password"
            id="password"
            className="input-field"
            value={password}
            onChange={this.onChangePassword}
            placeholder="Password"
          />
        </div>
      </div>
    )
  }

  renderUsernameField = () => {
    const {username} = this.state
    return (
      <div>
        <label className="input-label" htmlFor="username">
          Username*
        </label>
        <div className="input-container">
          <input
            type="text"
            id="username"
            className="input-field"
            value={username}
            onChange={this.onChangeUsername}
            placeholder="Username"
          />
        </div>
      </div>
    )
  }

  render() {
    const {showSubmitError, errorMsg} = this.state
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }
    return (
      <div className="login-form-container">
        <img
          src="https://res.cloudinary.com/deodlm2m0/image/upload/v1653024295/Rectangle_1467_1x_ak0ilp.png"
          className="login-image"
          alt="website login"
        />
        <form className="form-container" onSubmit={this.submitForm}>
          <img
            src="https://res.cloudinary.com/deodlm2m0/image/upload/v1653024560/Group_7731_1x_z8gzzy.png"
            className="login-website-logo"
            alt="login website logo"
          />
          {this.renderUsernameField()}
          {this.renderPasswordField()}
          <button
            type="submit"
            className="login-button"
            onClick={this.submitForm}
          >
            Login
          </button>
          {showSubmitError && <p className="error-message">*{errorMsg}</p>}
        </form>
      </div>
    )
  }
}

export default LoginForm
