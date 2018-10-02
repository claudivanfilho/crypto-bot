import React, { Component } from 'react'
import { SelectedItemProvider } from '../contexts/selectedItemContext'
import { OrderBookProvider } from '../contexts/orderBookContext'
import { TradeHistoryProvider } from '../contexts/tradeHistoryContext'
import { RobotsProvider } from '../contexts/robotsContext'
import { CoinsAvailbleProvider } from '../contexts/coinsAvailableContext'
import { OpenOrdersProvider } from '../contexts/openOrdersContext'
import { MyTradeHistoryProvider } from '../contexts/myTradeHistoryContext'
import { ChartProvider } from '../contexts/chartContext'

export default class App extends Component {
  render() {
    return (
      <SelectedItemProvider>
        <CoinsAvailbleProvider>
          <OpenOrdersProvider>
            <MyTradeHistoryProvider>
              <RobotsProvider>
                <OrderBookProvider>
                  <TradeHistoryProvider>
                    <ChartProvider>
                      <button className="ui primary button">
                        Save
                      </button>
                    </ChartProvider>
                  </TradeHistoryProvider>
                </OrderBookProvider>
              </RobotsProvider>
            </MyTradeHistoryProvider>
          </OpenOrdersProvider>
        </CoinsAvailbleProvider>
      </SelectedItemProvider>
    )
  }
}
