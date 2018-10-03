import React, { Component, Fragment } from 'react'
import { OrderBookConsumer } from '../contexts/orderBookContext'
import PropTypes from 'prop-types'

import OrderBookTable from './OrderBookTable'

class OrderBook extends Component {
  static propTypes = {
    orderBook: PropTypes.object,
  }
  render() {
    if (!this.props.orderBook.bids) return null
    return (
      <Fragment>
        {/* <h5 className="ma1 flex justify-center">Bids</h5> */}
        <OrderBookTable
          orders={this.props.orderBook.bids}
          color="blue"
        />
        {/* <h5 className="ma1 flex justify-center">Asks</h5> */}
        <OrderBookTable
          orders={this.props.orderBook.asks}
          color="red"
        />
      </Fragment>
    )
  }
}

export default function ComponentWithContext(props) {
  return (
    <OrderBookConsumer>
      {({ orderBook }) => (
        <OrderBook
          {...props}
          orderBook={orderBook} />
      )}
    </OrderBookConsumer>
  )
}
