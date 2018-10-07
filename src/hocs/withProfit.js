import React from 'react'
import { OrderBookConsumer } from '../contexts/orderBookContext'
import { MyTradeHistoryConsumer } from '../contexts/myTradeHistoryContext'
import { getProfit } from '../utils/helpers'

export function withProfit(WrappedComponent) {
  return class ComponentWithContext extends React.Component {
    render() {
      return (
        <OrderBookConsumer>
          {({ orderBook }) => (
            <MyTradeHistoryConsumer>
              {({ myTradeHistory }) => (
                <WrappedComponent
                  {...this.props}
                  profitToBid={
                    (orderBook &&
                    orderBook.bids &&
                    myTradeHistory &&
                    getProfit(myTradeHistory, orderBook.bids[0][0])) || 0
                  }
                  profitToAsk={
                    (orderBook &&
                    orderBook.asks &&
                    myTradeHistory &&
                    getProfit(myTradeHistory, orderBook.asks[0][0])) || 0
                  }
                />
              )}
            </MyTradeHistoryConsumer>
          )}
        </OrderBookConsumer>
      )
    }
  }
}
