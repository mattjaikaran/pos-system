import React from 'react'
import { Link } from 'react-router-dom'

const Header = () => (
  <div className="text-center">
    <h1>
      <a href="/#/">POS</a>
    </h1>
    <ul>
      <li className="lead list-unstyled">
        <Link to='/inventory'>Inventory</Link>
      </li>
      <li className="lead list-unstyled">
        <Link to='/'>POS</Link>
      </li>
      <li className="lead list-unstyled">
        <Link to='/transactions'>Transactions</Link>
      </li>
      <li className="lead list-unstyled">
        <Link to='/livecart'>Live Cart</Link>
      </li>
    </ul>
  </div>
)

export default Header
