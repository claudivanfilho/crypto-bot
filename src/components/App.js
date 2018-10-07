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
import { TickerProvider } from '../contexts/tickerContext'

import { withRouter } from 'react-router-dom'
import { UserConsumer } from '../contexts/userContext'

import Layout from './Layout'

class App extends Component {
  static propTypes = {
    user: PropTypes.object,
    loading: PropTypes.bool,
    history: PropTypes.any,
  }

  render() {
    if (!this.props.user && !this.props.loading) {
      this.props.history.push('/login')
    }
    return (
      <SelectedItemProvider>
        <CoinsAvailableProvider>
          <OpenOrdersProvider>
            <MyTradeHistoryProvider>
              <RobotsProvider>
                <OrderBookProvider>
                  <TradeHistoryProvider>
                    <ChartProvider>
                      <TickerProvider>
                        <Layout />
                      </TickerProvider>
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
const ComponentWithRouter = withRouter(App)

export default function ComponentWithContext(props) {
  return (
    <UserConsumer>
      {({ user, loading }) => (
        <ComponentWithRouter
          {...props}
          user={user}
          loading={loading} />
      )}
    </UserConsumer>
  )
}
