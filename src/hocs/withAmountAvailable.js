import React from 'react'
import { SelectedItemConsumer } from '../contexts/selectedItemContext'
import { CoinsAvailableConsumer } from '../contexts/coinsAvailableContext'

export function withAmountAvailable(WrappedComponent) {
  return class ComponentWithContext extends React.Component {
    getAmountAvailable = (coinsAvailable, selectedItem) => {
      if (coinsAvailable && coinsAvailable.length && selectedItem.pair) {
        const coinBTC = coinsAvailable.filter(
          coin => coin.coinName === selectedItem.pair.split('_')[0]
        ).pop()
        if (coinBTC) {
          return {
            available: parseFloat(coinBTC.available),
            btcValue: parseFloat(coinBTC.btcValue),
          }
        }
      }
      return {
        available: 0,
        btcValue: 0,
      }
    }

    render() {
      return (
        <SelectedItemConsumer>
          {({ selectedItem }) => (
            <CoinsAvailableConsumer>
              {({ coinsAvailable }) => (
                <WrappedComponent
                  {...this.props}
                  amountAvailable={this.getAmountAvailable(
                    coinsAvailable, selectedItem
                  )}
                />
              )}
            </CoinsAvailableConsumer>
          )}
        </SelectedItemConsumer>
      )
    }
  }
}
