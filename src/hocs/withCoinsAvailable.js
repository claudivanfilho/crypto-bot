import React from 'react'
import { CoinsAvailableConsumer } from '../contexts/coinsAvailableContext'

export function withCoinsAvailable(WrappedComponent) {
  return class ComponentWithCoinsAvailable extends React.Component {
    render() {
      return (
        <CoinsAvailableConsumer>
          {({ coinsAvailable }) => (
            <WrappedComponent
              {...this.props}
              coinsAvailable={coinsAvailable}
            />
          )}
        </CoinsAvailableConsumer>
      )
    }
  }
}
