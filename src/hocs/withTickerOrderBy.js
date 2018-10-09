import React from 'react'
import { TickerOrderByConsumer } from '../contexts/tickerOrderByContext'

export function withTickerOrderBy(WrappedComponent) {
  return class ComponentWithContext extends React.Component {
    render() {
      return (
        <TickerOrderByConsumer>
          {({ setOrderBy, sortCollection }) => (
            <WrappedComponent
              {...this.props}
              setOrderBy={setOrderBy}
              sortCollection={sortCollection}
            />
          )}
        </TickerOrderByConsumer>
      )
    }
  }
}
