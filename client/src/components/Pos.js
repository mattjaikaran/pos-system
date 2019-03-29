import React, { Component } from 'react'
import '../App.css'
import Header from './Header'
import io from 'socket.io-client'
import axios from 'axios'
import moment from 'moment'
import { Modal, Button } from 'react-bootstrap'
import LivePos from './LivePos'

const HOST = 'http://localhost:8080'
let socket = io.connect(HOST)

class Pos extends Component {
  constructor(props) {
    super(props)
    this.state = {
      items: [],
      quantity: 1,
      id: 0,
      open: true,
      close: false,
      addItemModal: false,
      checkOutModal: false,
      amountDueModal: false,
      totalPayment: 0,
      total: 0,
      changeDue: 0,
      name: '',
      price: 0
    }
  }

  componentDidUpdate() {
    if(this.state.items.length !== 0) {
      socket.emit('update-live-cart', this.state.items)
    }
  }

  handleSubmit = (e) => {
    e.preventDefault()
    this.setState({ addItemModal: false })
    const currentItem = {
      id: this.state.id++,
      name: this.state.name,
      price: this.state.price,
      quantity: this.state.quantity
    }
    const items = this.state.items
    items.push(currentItem)
    this.setState({ items: items })
  }

  handleName = (e) => this.setState({ name: e.target.value })
  handlePrice = (e) => this.setState({ price: e.target.value })

  handlePayment = (e) => {
    this.setState({ checkOutModal: false })
    const amountDiff = parseInt(this.state.total, 10) - parseInt(this.state.totalPayment, 10)
    if(this.state.total <= this.state.totalPayment) {
      this.setState({
        changeDue: amountDiff,
        receiptModal: true,
        items: [],
        total: 0
      })
      this.handleSaveToDB()
    } else {
      this.setState({
        changeDue: amountDiff,
        amountDueModal: true
      })
    }
  }

  handleQuantityChange = (id, quantity) => {
    const items = this.state.items.filter(item => {
      if(item.id === id) {
        item.quantity = quantity
        this.setState({ items: items })
      }
    })
  }

  handleCheckOut = (e) => {
    this.setState({ checkOutModal: true })
    const items = this.state.items
    let totalCost = 0
    for (var i = 0; i < items.length; i++) {
      const price = items[i].price * items[i].quantity
      totalCost = parseInt(totalCost, 10) + parseInt(price, 10)
    }
    this.setState({ total: totalCost })
  }

  handleSaveToDB = (e) => {
    const transaction = {
      date: moment().format('DD-MMM-YYY HH:mm:ss'),
      total: this.state.total,
      items: this.state.items
    }
    axios.post(`${HOST}/api/new`, transaction).catch(err => {
      console.log(err)
    })
  }
  render() {
    const { quantity, modal, items } = this.state
    const renderAmountDue = () => {
      return (
        <Modal show={this.state.amountDueModal}>
          <Modal.Header closeButton>
            <Modal.Title>Amount</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <h3>
              Amount Due
              <span className="text-danger">{this.state.changeDue}</span>
            </h3>
            <p>Customer Payment Incomplete. Try again</p>
          </Modal.Body>
        </Modal>
      )
    }
    const renderReceipt = () => {
      return (
        <Modal show={this.state.receiptModal}>
          <Modal.Header closeButton>
            <Modal.Title>Receipt</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <h3>
              Total:
              <span className="text-danger">{this.state.totalPayment}</span>
            </h3>
            <h3>
              Change Due
              <span className="text-success">{this.state.changeDue}</span>
            </h3>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={() => this.setState({ receiptModal: false })}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      )
    }
    const renderLivePos = () => {
      if(items.length === 0) {
        return <p>No products added</p>
      } else {
        return items.map(item => (
          <LivePos {...item} onQuantityChange={this.handleQuantityChange} />
        ), this)
      }
    }

    return (
      <div>
        <Header />
        <div className="container">
          <div className="text-center">
            <span className="lead">Total</span>
            <br />
            <span className="text-success checkout-total-price">${this.state.total}</span>
          </div>
          <div>
            <button
              className="btn btn-success lead"
              id="checkoutButton"
              onClick={this.handleCheckOut}>
              <i className="glyphicon glyphicon-shopping-cart" />
              <br />
              C<br />
              H<br />
              E<br />
              C<br />
              K<br />
              O<br />
              U<br />
              T
            </button>
            <div className="modal-body">
              <Modal show={this.state.checkOutModal}>
                <Modal.Header closeButton>
                  <Modal.Title>Checkout</Modal.Title>
                </Modal.Header>
                <Modal.body>
                  <div ng-hide="transactionComplete" className="lead">
                    <h3>
                      Total
                      <span className="text-danger">{this.state.total}</span>
                    </h3>
                    <form
                      class="form-horizontal"
                      name="checkoutForm"
                      onSubmit={this.handlePayment}
                      >
                      <div className="form-group">
                        <div className="input-group">
                          <div className="input-group-addon">$</div>
                          <input
                            type="number"
                            id="checkoutPaymentAmount"
                            className="form-control input-lg"
                            name="payment"
                            onChange={e =>
                              this.setState({ totalPayment: e.target.value})}
                            min="0"
                            />
                        </div>
                      </div>
                      <p className="text-danger">Enter Payment Amount</p>
                      <div className="lead" />
                      <Button
                        className="btn btn-primary btn-lg lead"
                        onClick={this.handlePayment}
                        >
                        Print Receipt
                      </Button>
                    </form>
                  </div>
                </Modal.body>
                <Modal.Footer>
                  <Button onClick={() => this.setState({ checkOutModal: false})}>Close</Button>
                </Modal.Footer>
              </Modal>
            </div>
          </div>
          {renderAmountDue()}
          {renderReceipt()}
          <table className="pos table table-responsive table-striped table-hover">
            <thead>
              <tr>
                <td colspan="6" className="text-center">
                  <span className="pull-left">
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => this.setState({ addItemModal: true })}>
                      <i className="glyphicon glyphicon-plus" /> Add Item
                    </button>
                  </span>
                  <Modal
                    onHide={this.close}
                    show={this.state.addItemModal}>
                    <Modal.Header closeButton>
                      <Modal.Title>Add item (Product)</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      <form
                        onSubmit={this.handleSubmit}
                        className="form-horizontal"
                        ref="form">
                        <div className="form-group row">
                          <label className="col-md-2 lead" htmlFor="name">
                            Name
                          </label>
                          <div className="col-md-8 input-group">
                            <input
                              className="form-control"
                              name="name"
                              required
                              onChange={this.handleName}
                              />
                          </div>
                        </div>
                        <div className="form-group row">
                          <label className="col-md-2 lead" htmlFor="price">
                            Price
                          </label>
                          <div className="col-md-8 input-group">
                            <div className="input-group-addon">$</div>
                            <input
                              type="number"
                              step="any"
                              min="0"
                              onChange={this.handlePrice}
                              className="form-control"
                              name="price"
                              required
                              />
                          </div>
                        </div>
                        <p className="text-danger">Enter price for item.</p>
                      </form>
                    </Modal.Body>
                    <Modal.Footer>
                      <Button onClick={this.handleSubmit}>
                        Add
                      </Button>
                      <Button onClick={() =>
                          this.setState({ addItemModal: false })}>
                        Cancel
                      </Button>
                    </Modal.Footer>
                  </Modal>
                </td>
              </tr>
            </thead>
            <tbody>{renderLivePos()}</tbody>
          </table>
        </div>
      </div>
    )
  }
}

export default Pos
