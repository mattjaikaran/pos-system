import React, { Component } from 'react'
import '../App.css'

class LivePos extends Component {
  handleChange = (id, itemNumber) => {
    this.props.onChange(id, itemNumber)
  }
  render() {
    const { id, name, price, quantity } = this.props
    let itemNumber = quantity
    return (
      <tr className="row">
        <td className="col-md-2">{name}</td>
        <td className="col-md-1">{price}</td>
        <td className="col-md-2">
          <button
            className="btn btn-sm pull-left"
            onClick={() => this.handleChange(id, --itemNumber)}
            >
            <i className="glyphicon glyphicon-trash" />
          </button>
        </td>
      </tr>
    )
  }
}

export default LivePos
