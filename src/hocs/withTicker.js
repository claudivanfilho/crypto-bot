import React from 'react'
import { TickerConsumer } from '../contexts/tickerContext'

export function withTicker(WrappedComponent) {
  // ...and returns another component...
  return class ComponentWithContext extends React.Component {
    normalizeTicker = (ticker) => (
      Object.keys(ticker).reduce((acc, key) => {
        const coinLeft = key.split('_')[0]
        return {
          ...acc,
          [coinLeft]: [
            {
              ...ticker[key], pair: key,
            }, ...(acc[coinLeft] || []),
          ],
        }
      }, {})
    )
    render() {
      return (
        <TickerConsumer>
          {({ ticker }) => (
            <WrappedComponent
              {...this.props}
              ticker={this.normalizeTicker(ticker)}
            />
          )}
        </TickerConsumer>
      )
    }
  }
}
