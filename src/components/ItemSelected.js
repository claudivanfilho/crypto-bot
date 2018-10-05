import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withSelectedItem } from '../hocs/withSelectedItem'

class ItemSelected extends Component {
  static propTypes = {
    selectedItem: PropTypes.object,
  }

  renderBuyOrder = () => (
    <div>Buy Order</div>
  )

  renderSellOrder = () => (
    <div>Sell Order</div>
  )

  renderLineData = (label, value) => (
    <div className="item">
      <div className="description">
        {label}: <a>{value}</a>
      </div>
    </div>
  )

  renderCoinAvailable = () => {
    return (
      <div className="ui celled horizontal list">
        {this.renderLineData('Available', this.props.selectedItem.btcValue)}
        {this.renderLineData('Create Sell Order', (
          <div>Sasdask</div>
        ))}
      </div>
    )
  }

  render() {
    const { selectedItem: item } = this.props
    if (!item.pair) return null
    let content = null
    console.log(item)
    if (item.rate && item.type === 'buy') content = this.renderBuyOrder()
    if (item.rate && item.type === 'sell') content = this.renderSellOrder()
    if (item.available) content = this.renderCoinAvailable()
    return (
      <div className="flex">
        <h4 className="ma0">{item.pair}</h4>
        <div className="pl0 pl5-ns">
          {content}
        </div>
      </div>
    )
  }
}

export default withSelectedItem(ItemSelected)

