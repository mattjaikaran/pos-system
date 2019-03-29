import React, { Component } from 'react'
import '../App.css'
import io from 'socket.io-client'
import Header from './Header'
import axios from 'axios'
import RecentTransactions from './RecentTransactions'
import LiveTransactions from './LiveTransactions'
import moment from 'moment'


const HOST = 'http://localhost:8080'
const url = `${HOST}/api/day-total`

class LiveCart extends Component {
  constructor(props) {
    super(props)
    this.state = {
      transactions: [],
      liveTransactions: []
    }
  }

  componentWillMount() {
    const socket = io.connect(HOST)
    console.dir(socket)
    axios.get(url).then(res => {
      this.setState({ transactions: res.data })
      console.log('response: ', res.data)
    })
    socket.on('update-live-cart-display', liveCart => {
      this.setState({ liveTransactions: liveCart })
    })
  }

  componentWillUnmount() {
    // socket.disconnect()
  }

  render() {
    const { transactions, liveTransactions } = this.state
    const renderRecentTransactions = () => {
      if(transactions.length === 0) {
        return <p>No recent transactions available</p>
      } else {
        return transactions.map(transaction => (
          <RecentTransactions {...transaction} />
        ))
      }
    }
    const renderDate = () => {
      return moment().format('MMM-DD-YYYY HH:mm:ss')
    }
    const renderLiveTransactions = () => {
      if(liveTransactions.length === 0) {
        return (
          <div className="">
            <div className="col-md-5 pull-right">
              <div>
                <div className="alert alert-warning text-center" role="alert">
                  <strong>Not Active:</strong> No items added at the moment
                </div>
              </div>
            </div>
          </div>
        )
      } else {
        return liveTransactions.map(liveTransaction => (
          <LiveTransactions {...liveTransaction} />
        ))
      }
    }
    return (
      <div>
        <Header />
        <div className="livecart row">
          <div className="col-md-5 pull-right">
            <div className="panel panel-primary">
              <div className="panel-heading text-center lead">
                {renderDate()}
              </div>
              <table className="receipt table table-hover">
                <thead>
                  <tr className="small">
                    <th>Quantity</th>
                    <th>Product</th>
                    <th>Price</th>
                  </tr>
                </thead>
                <tbody>{renderLiveTransactions()}</tbody>
              </table>
            </div>
          </div>
          <div className="col-md-5 pull-left">
            <div className="panel panel-default">
              <div className="panel-heading lead text-center">
                Recent Transactions
              </div>
              <div className="panel-body">
                <div className="text-center">
                  <span>Today's Sales</span>
                  <br />
                  <span className="text-success checkout-total-price">$</span>
                </div>
                <table className="table table-hover table-striped">
                  <thead>
                    <tr>
                      <th>Time</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>{renderRecentTransactions()}</tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default LiveCart
