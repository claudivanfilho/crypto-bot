import React, { Component, Fragment } from 'react'
import OrderBook from './OrderBook'
import CoinsAvailable from './CoinsAvailable'
import TradeHistory from './TradeHistory'

export default class LayoutOrderBook extends Component {
  render() {
    return (
      <Fragment>
        <div className="w-100 flex flex-wrap justify-between justify-start-ns ma3">
          <CoinsAvailable />
        </div>
        <hr className="o-30" />
        <div className="w-20-l ma3 fl">
          <OrderBook />
        </div>
        <div className="w-30-l ma3 fl">
          <TradeHistory />
        </div>
      </Fragment>
    )
  }
}

