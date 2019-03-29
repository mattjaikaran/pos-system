import React, { Component } from 'react'
import '../App.css'
import Header from './Header'
import CompleteTransactions from './CompleteTransactions'
import axios from 'axios'

const HOST = 'http://localhost:8080'
const url = `${HOST}/api/all`

class Transactions extends Component {
  constructor(props) {
    super(props)
    this.state = {
      transactions: []
    }
  }

  componentWillMount() {
    axios.get(url).then(res => {
      this.setState({ transactions: res.data })
      console.log('response', res.data)
    })
  }

  render() {
    const { transactions } = this.state
    const renderTransactions = () => {
      if(transactions.length === 0) {
        return <p>No transactions found</p>
      }
      return transactions.map(transaction => (
        <CompleteTransactions {...transaction} />
      ))
    }
    return (
      <div>
        <Header />
        <div className="text-center">
          <span className="">Todays's Sales</span>
          <br />
          <span className="text-success checkout-total-price">$</span>
        </div>
        <table className="table table-hover table-striped">
          <thead>
            <tr>
              <th>Time</th>
              <th>Total</th>
              <th>Products</th>
              <th>Open</th>
            </tr>
          </thead>
          <tbody>{renderTransactions()}</tbody>
        </table>
      </div>
    )
  }
}

export default Transactions
