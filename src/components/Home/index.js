import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'

import {Link} from 'react-router-dom'
import Slider from 'react-slick'

import './index.css'

import Header from '../Header'
import Footer from '../Footer'

const settings = {
  dots: false,
  infinite: false,
  speed: 500,
  slidesToShow: 4,
  slidesToScroll: 1,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 4,
        slidesToScroll: 1,
      },
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1,
      },
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1,
      },
    },
  ],
}

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class Home extends Component {
  state = {
    topRatedBooks: [],
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getTopRatedBooks()
  }

  getTopRatedBooks = async () => {
    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })
    const jwtToken = Cookies.get('jwt_token')
    const url = 'https://apis.ccbp.in/book-hub/top-rated-books'

    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(url, options)
    if (response.ok) {
      const data = await response.json()
      // console.log(data)
      const updatedData = data.books.map(eachBook => ({
        id: eachBook.id,
        authorName: eachBook.author_name,
        coverPic: eachBook.cover_pic,
        title: eachBook.title,
      }))
      // console.log(updatedData)
      this.setState({
        topRatedBooks: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  renderSlider = () => {
    const {topRatedBooks} = this.state
    return (
      <Slider {...settings}>
        {topRatedBooks.map(eachBook => {
          const {id, title, authorName, coverPic} = eachBook
          return (
            <div className="slick-item" key={id}>
              <Link to={`/books/${id}`}>
                <img className="book-image" src={coverPic} alt="cover pic" />
                <h1 className="title">{title}</h1>
                <p className="author-name">{authorName}</p>
              </Link>
            </div>
          )
        })}
      </Slider>
    )
  }

  retry = () => {
    this.getTopRatedBooks()
  }

  renderFailureView = () => (
    <div className="main-container">
      <img
        src="https://res.cloudinary.com/deodlm2m0/image/upload/v1653024561/Group_7522_uprjry.png"
        alt="failure view"
        className="failure-img"
      />
      <p className="failure-description">
        Something went wrong. Please try again
      </p>
      <button type="button" className="find-books-button" onClick={this.retry}>
        Try again
      </button>
    </div>
  )

  renderLoadingView = () => (
    <div className="loader-container" testid="loader">
      <Loader type="TailSpin" color="#0284C7" height={50} width={50} />
    </div>
  )

  renderAllBooks = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderSlider()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        <div className="home-container">
          <div className="home-content">
            <h1 className="home-heading">Find Your Next Favorite Books?</h1>
            <p className="home-description">
              You are in the right place. Tell us what titles or genres you have
              enjoyed in the past, and we will give you surprisingly insightful
              recommendations.
            </p>
            <Link to="/shelf">
              <button type="button" className="find-books-phn-button">
                Find Books
              </button>
            </Link>
            <div className="heading-and-btn-container">
              <h1 className="top-rated-heading">Top Rated Books</h1>
              <Link to="/shelf">
                <button type="button" className="find-books-button">
                  Find Books
                </button>
              </Link>
            </div>
            <div className="main-container">
              <div className="slick-container">{this.renderAllBooks()}</div>
            </div>
            <Footer />
          </div>
        </div>
      </>
    )
  }
}

export default Home
