import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { withSelectedItem } from '../../hocs/withSelectedItem'
import { withProfit } from '../../hocs/withProfit'
import { withAmountAvailable } from '../../hocs/withAmountAvailable'

import SellPanel from './SellPanel'
import BuyPanel from './BuyPanel'

class CoinAvailablePanel extends Component {
  static propTypes = {
    item: PropTypes.object,
    setSelectedItem: PropTypes.func,
    profitToBid: PropTypes.number,
    amountAvailable: PropTypes.shape({
      available: PropTypes.number,
      btcValue: PropTypes.number,
    }),
  }

  render() {
    return (
      <div className="w-100 flex justify-around">
        <div className="flex">
          <div className="description flex items-center">
            Available:
            <a className="ml2">
              {this.props.item.available}
            </a>
          </div>
          <div className="description flex items-center ml3">
            Profit:
            <a className="ml2">
              {this.props.profitToBid.toFixed(2)} %
            </a>
          </div>
        </div>
        <SellPanel
          item={this.props.item}
          setSelectedItem={this.props.setSelectedItem}
        />
        {this.props.amountAvailable.btcValue > 0.0001 &&
          <BuyPanel
            item={this.props.item}
            setSelectedItem={this.props.setSelectedItem}
          />
        }
      </div>
    )
  }
}

export default withSelectedItem(
  withProfit(withAmountAvailable(CoinAvailablePanel))
)

