import React, { Component, Fragment } from 'react'
import OrderBook from './OrderBook'
import CoinsAvailable from './CoinsAvailable'
import TradeHistory from './TradeHistory'
import Chart from './Chart'
import Robots from './Robots'
import OpenOrders from './OpenOrders'
import ItemSelected from './ItemSelected'
import CoinsTabbed from './CoinsTabbed'
import SideBar from './SideBar'

const SIDEBAR_WIDTH = 40

export default class Layout extends Component {
  state = {
    visibility: {
      openOrders: true,
      robots: true,
      coinsAvailable: true,
      itemSelected: true,
      coinsTabbed: true,
      orderBook: true,
      chart: true,
      tradeHistory: true,
    },
  }

  toogleItem = (key) => this.setState({
    visibility: {
      ...this.state.visibility,
      [key]: !this.state.visibility[key],
    },
  })

  render() {
    return (
      <Fragment>
        <div className="flex flex-column" style={{
          width: `${SIDEBAR_WIDTH}px`,
          height: '100vh',
          position: 'fixed',
        }}>
          <SideBar
            visibilityItems={this.state.visibility}
            handleToogleItem={this.toogleItem}
          />
        </div>
        <div className="relative" style={{
          width: `calc(100% - ${SIDEBAR_WIDTH}px)`,
          left: `${SIDEBAR_WIDTH}px`,
        }}>
          {
            this.state.visibility.openOrders && (
              <Fragment>
                <div className="flex flex-wrap justify-between justify-start-ns pa3">
                  <OpenOrders />
                </div>
                <hr className="o-30 pa0 ma0" />
              </Fragment>
            )
          }
          {
            this.state.visibility.robots && (
              <Fragment>
                <div className="flex flex-wrap justify-between justify-start-ns pa3">
                  <Robots />
                </div>
                <hr className="o-30 pa0 ma0" />
              </Fragment>
            )
          }
          {
            this.state.visibility.coinsAvailable && (
              <Fragment>
                <div className="flex flex-wrap justify-between justify-start-ns pa3">
                  <CoinsAvailable />
                </div>
                <hr className="o-30 pa0 ma0" />
              </Fragment>
            )
          }
          {
            this.state.visibility.itemSelected && (
              <Fragment>
                <div className="w-100 pa3">
                  <ItemSelected />
                </div>
                <hr className="o-30 pa0 ma0" />
              </Fragment>
            )
          }
          <div className="w-100 w-30-l pa3 fl">
            {this.state.visibility.coinsTabbed && <CoinsTabbed />}
            {this.state.visibility.orderBook && <OrderBook />}
          </div>
          {
            this.state.visibility.coinsTabbed && this.state.visibility.orderBook && (
              <hr className="o-30 pa0 ma0" />
            )
          }
          {
            this.state.visibility.chart && (
              <div className="w-100 w-70-l pa3 fl">
                <Chart />
              </div>
            )
          }
          {
            this.state.visibility.tradeHistory && (
              <div className="w-100 w-70-l pa3 fl">
                <TradeHistory />
              </div>
            )
          }
        </div>
      </Fragment>
    )
  }
}

