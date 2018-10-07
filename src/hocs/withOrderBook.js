import React from 'react'
import { OrderBookConsumer } from '../contexts/orderBookContext'

export function withOrderBook(WrappedComponent) {
  // ...and returns another component...
  return class ComponentWithSelectedItemContext extends React.Component {
    render() {
      return (
        <OrderBookConsumer>
          {({ orderBook }) => (
            <WrappedComponent
              {...this.props}
              orderBook={orderBook}
            />
          )}
        </OrderBookConsumer>
      )
    }
  }
}
