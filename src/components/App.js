import '../styles.css'
import '../tachyons.css'

import React, { Component } from 'react'
import { SelectedItemProvider } from '../contexts/selectedItemContext'
import { OrderBookProvider } from '../contexts/orderBookContext'
import { TradeHistoryProvider } from '../contexts/tradeHistoryContext'
import { RobotsProvider } from '../contexts/robotsContext'
import { CoinsAvailableProvider } from '../contexts/coinsAvailableContext'
import { OpenOrdersProvider } from '../contexts/openOrdersContext'
import { MyTradeHistoryProvider } from '../contexts/myTradeHistoryContext'
import { ChartProvider } from '../contexts/chartContext'
import Layout from './Layout'

export default class App extends Component {
  render() {
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
