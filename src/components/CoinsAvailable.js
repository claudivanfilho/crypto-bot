import React, { Component, Fragment } from 'react'
import { CoinsAvailableConsumer } from '../contexts/coinsAvailableContext'
import PropTypes from 'prop-types'
import ItemSelectable from './ItemSelectable'
import coinIcon from '../images/coin.svg'

class CoinsAvailable extends Component {
  static propTypes = {
    coinsAvailable: PropTypes.array,
  }

  getPair = (coinName) => {
    if (coinName === 'BTC') return 'USDT_BTC'
    return `BTC_${coinName}`
  }

  render() {
    if (!this.props.coinsAvailable) return null
    return (
      <Fragment>
        <img alt="coins-icon" height="24" src={coinIcon} className="dn flex-ns ml2 mr3" />
        {
          this.props.coinsAvailable.map(coin => (
            <ItemSelectable
              key={coin.coinName}
              item={{ ...coin, pair: this.getPair(coin.coinName) }}
            >
              {(isSelected) => {
                return (
                  <div className="mb3 mb0-ns ui labeled button" tabIndex="0">
                    <div className="ui green button f7">
                      {coin.coinName}
                    </div>
                    <a className={`ui basic breen left pointing label f7 ${isSelected ? 'bg-success white' : ''}`}>
                      {coin.btcValue}
                    </a>
                  </div>
                )
              }}
            </ItemSelectable>
          ))
        }
      </Fragment>
    )
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
