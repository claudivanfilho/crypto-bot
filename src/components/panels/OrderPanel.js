import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { withAmountAvailable } from '../../hocs/withAmountAvailable'
import { withProfit } from '../../hocs/withProfit'
import API from '../../api'
import BuyPanel from './BuyPanel'

class OrderPanel extends Component {
  static propTypes = {
    item: PropTypes.object,
    setSelectedItem: PropTypes.func,
    profitToBid: PropTypes.number,
    amountAvailable: PropTypes.shape({
      available: PropTypes.number,
      btcValue: PropTypes.number,
    }),
  }

  handleCancelButton = () => {
    API.cancel(this.props.item.orderNumber).then(() => {
      alert('Order canceled!')
      this.props.setSelectedItem({ pair: this.props.item.pair })
    }).catch((err) => alert(`Error on cancel: ${err.message}`))
  }

  render() {
    return (
      <div className="w-100 flex justify-start">
        <div className="flex items-center">
          <div className="description flex items-center">
            Amount:
            <a className="ml2">
              {this.props.item.amount}
            </a>
          </div>
          <div className="ml3 description flex items-center">
            Price:
            <a className="ml2">
              {this.props.item.rate}
            </a>
          </div>
          {
            this.props.item.type === 'sell' && (
              <div className="description flex items-center ml3">
                  Profit:
                <a className="ml2">
                  {this.props.profitToBid.toFixed(2)} %
                </a>
              </div>

            )
          }
          <button
            className="ui h2 pa0 pr5 pl5 ml3 button"
            onClick={this.handleCancelButton}
          >
              Cancel
          </button>
        </div>
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

export default withAmountAvailable(withProfit(OrderPanel))
