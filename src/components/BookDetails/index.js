import {Component} from 'react'
import {Link} from 'react-router-dom'
import {BsFillStarFill} from 'react-icons/bs'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'

import Header from '../Header'
import './index.css'
import Footer from '../Footer'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class BookDetails extends Component {
  state = {
    bookData: {},
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getProductData()
  }

  getFormattedData = data => ({
    title: data.title,
    readStatus: data.read_status,
    coverPic: data.cover_pic,
    id: data.id,
    authorName: data.author_name,
    rating: data.rating,
    aboutBook: data.about_book,
    aboutAuthor: data.about_author,
  })

  getProductData = async () => {
    const {match} = this.props
    const {params} = match
    const {id} = params

    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })
    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = ` https://apis.ccbp.in/book-hub/books/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const fetchedData = await response.json()
      console.log(fetchedData.book_details)
      const updatedData = this.getFormattedData(fetchedData.book_details)
      console.log(updatedData)
      this.setState({
        bookData: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    }
    if (response.status === 404) {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  renderFailureView = () => (
    <div className="books-container">
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

  renderBookDetailsView = () => {
    const {bookData} = this.state
    const {
      id,
      title,
      authorName,
      aboutAuthor,
      aboutBook,
      rating,
      readStatus,
      coverPic,
    } = bookData

    return (
      <Link to={`/books/${id}`} className="link-item">
        <div className="book-details-container">
          <div className="details-card">
            <img src={coverPic} alt={title} className="book-img" />
            <div className="heading-container">
              <h1 className="book-title">{title}</h1>
              <p className="book-author">{authorName}</p>
              <div className="rating-div">
                <p>Avg Rating </p>
                <BsFillStarFill className="star-icon" />
                <p className="rating">{rating}</p>
              </div>
              <p className="status">
                Status : <span className="span">{readStatus} </span>
              </p>
            </div>
          </div>
          <hr className="hr-line" />
          <div className="about-div">
            <h1 className="sub-heading">About Author</h1>
            <p className="para">{aboutAuthor}</p>
          </div>
          <div className="about-div">
            <h1 className="sub-heading">About Book</h1>
            <p className="para">{aboutBook}</p>
          </div>
        </div>
      </Link>
    )
  }

  renderAllDetails = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderBookDetailsView()
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
        <div className="main-container">{this.renderAllDetails()}</div>
        <Footer />
      </>
    )
  }
}

export default BookDetails
