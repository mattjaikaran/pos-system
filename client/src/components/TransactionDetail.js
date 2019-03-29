import React, { Component } from 'react'
import '../App.css'

class TransactionDetail extends Component {
  render() {
    const { quantity, name, price } = this.props
    const productTotal = parseInt(quantity, 10) * parseInt(price, 10)
    return (
      <tbody>
        <tr>
          <td>{quantity}</td>
          <td>
            <a href="#/">{name}</a>
          </td>
          <td>
            <span>{productTotal}</span>
          </td>
        </tr>
      </tbody>
    )
  }
}

export default TransactionDetail
