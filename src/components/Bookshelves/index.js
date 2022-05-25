import {Component} from 'react'
import {Link} from 'react-router-dom'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {BsSearch, BsFillStarFill} from 'react-icons/bs'

// import Loader from 'react-loader-spinner'

import './index.css'

import Header from '../Header'
import Footer from '../Footer'
import TabItem from '../TabItem'

const bookshelvesList = [
  {
    id: '22526c8e-680e-4419-a041-b05cc239ece4',
    value: 'ALL',
    label: 'All',
  },
  {
    id: '37e09397-fab2-46f4-9b9a-66b2324b2e22',
    value: 'READ',
    label: 'Read',
  },
  {
    id: '2ab42512-3d05-4fba-8191-5122175b154e',
    value: 'CURRENTLY_READING',
    label: 'Currently Reading',
  },
  {
    id: '361d5fd4-9ea1-4e0c-bd47-da2682a5b7c8',
    value: 'WANT_TO_READ',
    label: 'Want to Read',
  },
]

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class Bookshelves extends Component {
  state = {
    apiStatus: apiStatusConstants.initial,
    booksData: [],
    activeCategoryId: bookshelvesList[0].value,
    searchInput: '',
    activeLabel: bookshelvesList[0].label,
  }

  componentDidMount() {
    this.getBooks()
  }

  getBooks = async () => {
    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })
    const jwtToken = Cookies.get('jwt_token')
    const {activeCategoryId, searchInput} = this.state
    console.log(activeCategoryId)
    const apiUrl = `https://apis.ccbp.in/book-hub/books?shelf=${activeCategoryId}&search=${searchInput}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const fetchedData = await response.json()
      const updatedData = fetchedData.books.map(books => ({
        title: books.title,
        readStatus: books.read_status,
        coverPic: books.cover_pic,
        id: books.id,
        authorName: books.author_name,
        rating: books.rating,
      }))
      console.log(updatedData)
      this.setState({
        booksData: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  searchBooks = () => {
    this.getBooks()
  }

  retry = () => {
    this.getBooks()
  }

  onChangeSearchInput = event => {
    this.setState({searchInput: event.target.value})
  }

  changeCategory = activeCategoryId => {
    this.setState({activeCategoryId}, this.getBooks)
  }

  changeLabel = activeLabel => {
    this.setState({activeLabel})
  }

  renderBooksList = () => {
    const {booksData, searchInput} = this.state
    const searchResults = booksData.filter(eachBook =>
      eachBook.title.toLowerCase().includes(searchInput.toLowerCase()),
    )
    // console.log(searchResults)
    return (
      <ul className="books-list">
        {searchResults.length === 0 ? (
          <div className="no-results-div">
            <img
              src="https://res.cloudinary.com/deodlm2m0/image/upload/v1653310017/Asset_1_1booksnotfound_nd7y3k.png"
              alt="no books"
              className="no-books-img"
            />
            <p>Your search for {searchInput} did not find any matches</p>
          </div>
        ) : (
          searchResults.map(eachBook => (
            <Link to={`/books/${eachBook.id}`} className="link-item">
              <li className="book-item" key={eachBook.id}>
                <>
                  <img
                    src={eachBook.coverPic}
                    alt={eachBook.title}
                    className="book-img"
                  />
                </>
                <div className="book-details">
                  <h1 className="book-title">{eachBook.title}</h1>
                  <p className="book-author">{eachBook.authorName}</p>
                  <div className="rating-div">
                    <p>Avg Rating </p>
                    <BsFillStarFill className="star-icon" />
                    <p className="rating">{eachBook.rating}</p>
                  </div>
                  <p className="status">
                    Status: <span className="span">{eachBook.readStatus} </span>
                  </p>
                </div>
              </li>
            </Link>
          ))
        )}
      </ul>
    )
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

  renderAllBooks = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderBooksList()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    const {searchInput, activeCategoryId, activeLabel} = this.state

    return (
      <>
        <Header />
        <div className="main-container">
          <div className="input-container">
            <input
              type="search"
              placeholder="search"
              onChange={this.onChangeSearchInput}
              value={searchInput}
              className="input-field"
            />
            <button
              type="button"
              testid="searchButton"
              className="search-btn"
              onClick={this.searchBooks}
            >
              <BsSearch className="search-icon" />
            </button>
          </div>
          <div className="category-container">
            <h1 className="bookshelves-heading">Bookshelves</h1>
            <ul className="category-list">
              <TabItem
                bookshelvesList={bookshelvesList}
                changeCategory={this.changeCategory}
                activeCategoryId={activeCategoryId}
                activeLabel={activeLabel}
                changeLabel={this.changeLabel}
              />
            </ul>
          </div>
          <div className="books-container">
            <h1 className="books-heading">{activeLabel} Books</h1>
            {this.renderAllBooks()}
          </div>
        </div>
        <Footer />
      </>
    )
  }
}

export default Bookshelves
