import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { withSelectedItem } from '../hocs/withSelectedItem'

class CoinsTable extends Component {
  static propTypes = {
    coins: PropTypes.array,
    selectedItem: PropTypes.object,
    setSelectedItem: PropTypes.func,
  }

  render() {
    if (!this.props.coins) return <div>Loading</div>
    return (
      <div>
        <div className="flex justify-between pl5">
          <span className="w-33 flex justify-start">Name</span>
          <span className="w-33 flex justify-start">LastBid</span>
          <span className="w-33 flex justify-start">% 24h</span>
        </div>
        <div className="overflow-y-auto" style={{ height: '30rem' }}>
          <table className={'ui gray unstackable celled table ma0'}>
            <tbody>
              {this.props.coins.map(coin => (
                <tr
                  key={coin.pair}
                  className={`f6 pointer dim 
                    ${coin.pair === this.props.selectedItem.pair}
                  `}
                  onClick={() => this.props.setSelectedItem(coin)}
                >
                  <td>{coin.pair.split('_')[1]}</td>
                  <td>{coin.last}</td>
                  <td>{(coin.percentChange * 100).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>

        </div>

      </div>
    )
  }
}

export default withSelectedItem(CoinsTable)
