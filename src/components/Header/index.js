import {Component} from 'react'
import {Link, withRouter} from 'react-router-dom'

import Cookies from 'js-cookie'

import './index.css'

class Header extends Component {
  state = {
    displayMenu: false,
  }

  showMenu = () => {
    this.setState({displayMenu: true})
    console.log('show menu btn clicked')
  }

  hideMenu = () => {
    this.setState({displayMenu: false})
    console.log('hide menu btn clicked')
  }

  onClickLogout = () => {
    const {history} = this.props
    Cookies.remove('jwt_token')
    history.replace('/login')
  }

  render() {
    const {displayMenu} = this.state
    return (
      <nav className="nav-header">
        <div className="nav-content">
          <Link to="/">
            <img
              className="website-logo"
              src="https://res.cloudinary.com/deodlm2m0/image/upload/v1653024560/Group_7731_1x_z8gzzy.png"
              alt="website logo"
            />
          </Link>
          <button
            type="button"
            className="mobile-menu-item"
            onClick={this.showMenu}
          >
            <img
              src="https://res.cloudinary.com/deodlm2m0/image/upload/v1653046616/icon_hakjbf.png"
              className="nav-bar-img"
              alt="menu"
            />
          </button>
          <div className="nav-bar-large-container">
            <ul className="nav-menu">
              <li className="nav-menu-item">
                <Link to="/" className="nav-link">
                  Home
                </Link>
              </li>
              <li className="nav-menu-item">
                <Link to="/shelf" className="nav-link">
                  Bookshelves
                </Link>
              </li>
            </ul>
            <button
              type="button"
              className="logout-desktop-btn"
              onClick={this.onClickLogout}
            >
              Logout
            </button>
          </div>
        </div>
        {displayMenu ? (
          <ul className="mobile-menu-list">
            <li className="mobile-menu-item">
              <Link to="/" className="nav-link">
                Home
              </Link>
            </li>
            <li className="mobile-menu-item">
              <Link to="/shelf" className="nav-link">
                Bookshelves
              </Link>
            </li>
            <button
              type="button"
              onClick={this.onClickLogout}
              className="nav-menu-logout-btn"
            >
              Logout
            </button>
            <button
              type="button"
              onClick={this.hideMenu}
              className="mobile-menu-item"
            >
              <img
                src="https://res.cloudinary.com/deodlm2m0/image/upload/v1653046616/Shape_u2na33.png"
                className="nav-menu-btn"
                alt="close"
              />
            </button>
          </ul>
        ) : null}
      </nav>
    )
  }
}

export default withRouter(Header)
