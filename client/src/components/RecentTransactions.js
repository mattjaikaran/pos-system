import React, { Component } from 'react'
import '../App.css'

class RecentTransactions extends Component {
  render() {
    const { date, total } = this.props
    return (
      <div className="row">
        <tr>
          <td className="col-md-2">
            <a href="#/transaction/{{ transaction._id }}">{date}</a>
          </td>
          <td className="col-md-2">{total}</td>
        </tr>
      </div>
    )
  }
}

export default RecentTransactions
