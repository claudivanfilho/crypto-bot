import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { SelectedItemProvider } from '../contexts/selectedItemContext'
import { OrderBookProvider } from '../contexts/orderBookContext'
import { TradeHistoryProvider } from '../contexts/tradeHistoryContext'
import { RobotsProvider } from '../contexts/robotsContext'
import { CoinsAvailableProvider } from '../contexts/coinsAvailableContext'
import { OpenOrdersProvider } from '../contexts/openOrdersContext'
import { MyTradeHistoryProvider } from '../contexts/myTradeHistoryContext'
import { ChartProvider } from '../contexts/chartContext'

import { UserConsumer } from '../contexts/userContext'

import Layout from './Layout'

class App extends Component {
  static propTypes = {
    user: PropTypes.object,
    loading: PropTypes.bool,
  }

  render() {
    if (!this.props.user && !this.props.loading) window.location.assign('/auth/login')
    if (this.props.loading) return null
    return (
      <SelectedItemProvider>
        <CoinsAvailableProvider>
          <OpenOrdersProvider>
            <MyTradeHistoryProvider>
              <RobotsProvider>
                <OrderBookProvider>
                  <TradeHistoryProvider>
                    <ChartProvider>
                      <Layout />
                    </ChartProvider>
                  </TradeHistoryProvider>
                </OrderBookProvider>
              </RobotsProvider>
            </MyTradeHistoryProvider>
          </OpenOrdersProvider>
        </CoinsAvailableProvider>
      </SelectedItemProvider>
    )
  }
}

export default function ComponentWithContext(props) {
  return (
    <UserConsumer>
      {({ user, loading }) => (
        <App
          {...props}
          user={user}
          loading={loading} />
      )}
    </UserConsumer>
  )
}
