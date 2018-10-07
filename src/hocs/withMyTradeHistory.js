import React from 'react'
import { MyTradeHistoryConsumer } from '../contexts/myTradeHistoryContext'

export function withMyTradeHistory(WrappedComponent) {
  // ...and returns another component...
  return class ComponentWithSelectedItemContext extends React.Component {
    render() {
      return (
        <MyTradeHistoryConsumer>
          {({ myTradeHistory }) => (
            <WrappedComponent
              {...this.props}
              myTradeHistory={myTradeHistory}
            />
          )}
        </MyTradeHistoryConsumer>
      )
    }
  }
}
