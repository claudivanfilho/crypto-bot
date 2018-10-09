import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { withSelectedItem } from '../hocs/withSelectedItem'
import { withTickerOrderBy } from '../hocs/withTickerOrderBy'
import OrderBy from '../constants/tickerOrderBy'

class CoinsTable extends Component {
  static propTypes = {
    coins: PropTypes.array,
    selectedItem: PropTypes.object,
    setSelectedItem: PropTypes.func,
    setOrderBy: PropTypes.func,
    sortCollection: PropTypes.func,
  }

  render() {
    if (!this.props.coins) return null
    const coins = this.props.sortCollection(this.props.coins)
    return (
      <div>
        <div className="flex justify-between pl4">
          {OrderBy.options.map(opt => (
            <span
              key={opt.value}
              className="w-33 flex justify-start pointer dim"
              onClick={() => this.props.setOrderBy(opt.value)}
            >
              {opt.name}
            </span>
          ))}
        </div>
        <div className="overflow-y-auto" style={{ maxHeight: '30rem' }}>
          <table className={'ui gray unstackable celled table ma0'}>
            <tbody>
              {coins.map(coin => (
                <tr
                  key={coin.pair}
                  className={`f6 pointer dim 
                    ${coin.pair === this.props.selectedItem.pair ? 'positive' : ''}
                  `}
                  onClick={() => this.props.setSelectedItem(coin)}
                >
                  <td className="w-33">{coin.pair.split('_')[1]}</td>
                  <td className="w-33">{coin.last}</td>
                  <td className={`w-33 ${coin.percentChange < 0 ? 'f-red' : 'f-blue'}`}>
                    {(coin.percentChange * 100).toFixed(2)} %
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

        </div>
      </div>
    )
  }
}

export default withTickerOrderBy(withSelectedItem(CoinsTable))
