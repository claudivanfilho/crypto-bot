import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import ItemSelectable from './ItemSelectable'

import CoinIcon from '../icons/CoinIcon'

import { withCoinsAvailable } from '../hocs/withCoinsAvailable'

class CoinsAvailable extends Component {
  static propTypes = {
    coinsAvailable: PropTypes.array,
  }

  getPair = (coinName) => `BTC_${coinName}`

  render() {
    // const coinsAvailable = [
    //   { coinName: 'BTC', btcValue: '0.05', available: '0.05' },
    //   { coinName: 'NXT', btcValue: '0.05', available: '2000' },
    // ]
    const { coinsAvailable } = this.props
    if (!coinsAvailable) return null
    return (
      <Fragment>
        <CoinIcon size={24} className="dn flex-ns ml2 mr3" />
        {
          coinsAvailable.map(coin => (
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

export default withCoinsAvailable(CoinsAvailable)
