import React, { Component } from 'react'
import { CoinsAvailableConsumer } from '../contexts/coinsAvailableContext'
import PropTypes from 'prop-types'
import ItemSelectable from './ItemSelectable'

class CoinsAvailable extends Component {
  static propTypes = {
    coinsAvailable: PropTypes.array,
  }

  getPair = (coinName) => {
    if (coinName === 'BTC') return 'USDT_BTC'
    return `BTC_${coinName}`
  }

  render() {
    if (!this.props.coinsAvailable) return <div>Loading</div>
    return this.props.coinsAvailable.map(coin => (
      <ItemSelectable
        key={coin.coinName}
        item={{ ...coin, pair: this.getPair(coin.coinName) }}
      >
        {(isSelected) => {
          return (
            <div className="ui labeled button" tabIndex="0">
              <div className="ui green button f6">
                {coin.coinName}
              </div>
              <a className={`ui basic breen left pointing label f6 ${isSelected ? 'bg-success white' : ''}`}>
                {coin.btcValue}
              </a>
            </div>
          )
        }}
      </ItemSelectable>
    ))
  }
}

export default function ComponentWithContext(props) {
  return (
    <CoinsAvailableConsumer>
      {({ coinsAvailable }) => (
        <CoinsAvailable
          {...props}
          coinsAvailable={coinsAvailable}
        />
      )}
    </CoinsAvailableConsumer>
  )
}
