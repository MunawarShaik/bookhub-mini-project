import {Link} from 'react-router-dom'
import './index.css'

const NotFound = () => (
  <div className="not-found-container">
    <img
      src="https://res.cloudinary.com/deodlm2m0/image/upload/v1653024560/Group_7484pagenotfound_pqjx06.png"
      alt="not found"
      className="not-found-img"
    />
    <h1 className="heading">Page Not Found</h1>
    <p>we are sorry, the page you requested could not be found</p>
    <Link to="/">
      <button className="button" type="button">
        Go Back to Home
      </button>
    </Link>
  </div>
)

export default NotFound
