import React, { Component, Fragment } from 'react'
import OrderBook from './OrderBook'
import CoinsAvailable from './CoinsAvailable'
import TradeHistory from './TradeHistory'
import Chart from './Chart'
import Robots from './Robots'
import OpenOrders from './OpenOrders'

export default class LayoutOrderBook extends Component {
  render() {
    return (
      <Fragment>
        <div className="flex flex-wrap justify-between justify-start-ns pa3">
          <OpenOrders />
        </div>
        <hr className="o-30 pa0 ma0" />
        <div className="flex flex-wrap justify-between justify-start-ns pa3">
          <Robots />
        </div>
        <hr className="o-30 pa0 ma0" />
        <div className="w-100 flex flex-wrap justify-between justify-start-ns pa3">
          <CoinsAvailable />
        </div>
        <hr className="o-30 pa0 ma0" />
        <div className="w-100 w-20-l pa3 fl">
          <OrderBook />
        </div>
        <div className="w-100 w-80-l pa3 fl">
          <Chart />
        </div>
        <div className="w-100 w-80-l pa3 fl">
          <TradeHistory />
        </div>
      </Fragment>
    )
  }
}

