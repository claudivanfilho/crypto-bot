import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { withSelectedItem } from '../hocs/withSelectedItem'
import CoinAvailablePanel from './panels/CoinAvailablePanel'
import OrderPanel from './panels/OrderPanel'

class ItemSelected extends Component {
  static propTypes = {
    selectedItem: PropTypes.object,
  }

  render() {
    const { selectedItem: item } = this.props
    if (!item.pair) return null
    let content = null
    if (item.rate && item.type === 'buy') content = <OrderPanel item={item} />
    if (item.rate && item.type === 'sell') content = <OrderPanel item={item} />
    if (item.available) content = <CoinAvailablePanel item={item} />
    return (
      <div className="flex">
        <h4 className="ma0 flex items-center">{item.pair}</h4>
        <div className="w-100 pl0 pl5-ns">
          {content}
        </div>
      </div>
    )
  }
}

export default withSelectedItem(ItemSelected)

