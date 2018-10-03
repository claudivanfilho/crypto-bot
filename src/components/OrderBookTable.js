import React, { Component } from 'react'
import PropTypes from 'prop-types'

export default class OrderBookTable extends Component {
  static propTypes = {
    orders: PropTypes.array,
    color: PropTypes.string,
    pricesWithOrders: PropTypes.array,
  }

  calcOrdersSum(orders, endIndex) {
    return orders.slice(0, endIndex + 1).reduce((acc, value) => (
      acc + value[0] * value[1]
    ), 0)
  }

  render() {
    if (!this.props.orders) return <div>Loading</div>
    return (
      <div>
        <div className="flex justify-between pl5">
          <span className="w-33 flex justify-start">Price</span>
          <span className="w-33 flex justify-start">Total</span>
          <span className="w-33 flex justify-start">Sum</span>
        </div>
        <div className="overflow-y-auto overflow-x-hidden" style={{ height: '30rem' }}>
          <table className={`ui ${this.props.color} unstackable table ma0`}>
            <tbody>
              {this.props.orders.map((order, index) => (
                <tr key={`order-${index}`} className="f6">
                  <td>{order[0]}</td>
                  <td>{(order[0] * order[1]).toFixed(8)}</td>
                  <td>{this.calcOrdersSum(this.props.orders, index).toFixed(8)}</td>
                </tr>
              ))}
            </tbody>
          </table>

        </div>

      </div>
    )
  }
}
