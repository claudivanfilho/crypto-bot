import React, { Component } from 'react'
import PropTypes from 'prop-types'

import API from '../../api'
import { withOrderBook } from '../../hocs/withOrderBook'

class SellPanel extends Component {
  static propTypes = {
    item: PropTypes.object,
    setSelectedItem: PropTypes.func,
    orderBook: PropTypes.object,
  }

  state = {
    price: '',
    amount: '',
  }

  handleSellButton = () => {
    if (!this.state.price || !this.state.amount) return
    API[this.isImmediate() ? 'sellImmediate' : 'sell'](
      this.props.item.pair, this.state.amount, this.state.price
    ).then(() => {
      alert(`Sell at price ${this.state.price} was made.`)
      this.props.setSelectedItem({ pair: this.props.item.pair })
    }).catch((err) => alert(`Error on sell: ${err.message}`))
  }

  handlePriceChange = (evt) => this.setState({ price: evt.target.value })
  handleAmountChange = (evt) => this.setState({ amount: evt.target.value })

  isImmediate = () => (
    this.state.price && this.props.orderBook.bids && this.state.price <= this.props.orderBook.bids[0][0]
  )

  render() {
    return (
      <div className="ui form">
        <div className="flex items-start fields ma0 ml3 ba pa2 b--light-gray">
          <div className="field flex items-center">
            <label className="ma0 f4 mr2">A: </label>
            <input
              value={this.state.amount}
              onChange={this.handleAmountChange}
              className="h2"
              placeholder="Amount"
            />
          </div>
          <div className="field flex flex-column items-start">
            <div className="flex items-center">
              <label className="ma0 f4 mr2 b">P: </label>
              <input
                value={this.state.price}
                onChange={this.handlePriceChange}
                className="h2"
                placeholder="Price"
              />
            </div>
            <div className="field flex items-center f6 ma2">
              <label className="ma0 f4 mr2 f6">Total: </label>
              {(this.state.price * this.state.amount).toFixed(8)}
            </div>
          </div>
          <button
            className="ui h2 pa0 pr5 pl5 red button"
            onClick={this.handleSellButton}
          >
            {this.isImmediate() ? 'Sell Immediate' : 'Sell'}
          </button>
        </div>
      </div>
    )
  }
}

export default withOrderBook(SellPanel)
