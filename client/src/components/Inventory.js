import React, { Component } from 'react'
import '../App.css'
import Header from './Header'
import Product from './Product'
import axios from 'axios'

const HOST = 'http://localhost:8080'

class Inventory extends Component {
  constructor(props) {
    super(props)
    this.state = {
      products: []
    }
  }
  componentWillMount() {
    const url = `${HOST}/api/inventory/products`
    axios.get(url).then(res => {
      this.setState({ products: res.data })
    })
  }
  render() {
    const { products} = this.state
    const renderProducts = () => {
      if(products.length === 0) {
        return <p>{products}</p>
      }
      return products.map(product => <Product {...product} />)
    }
    return (
      <div>
        <Header />
        <div className="container">
          <a
            href="#/inventory/create-product"
            className="btn btn-success pull-right"
            ><i className="glyphicon glyphicon-plus" /> Add New Item
          </a>
          <div className="mt-5">
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">Name</th>
                  <th scope="col">Price</th>
                  <th scope="col">Quantity on Hand</th>
                  <th />
                </tr>
              </thead>
              <tbody>{renderProducts()}</tbody>
            </table>
          </div>
        </div>
      </div>
    )
  }
}

export default Inventory
