import React, { Component } from 'react'
import TradingViewWidget from 'react-tradingview-widget'
import PropTypes from 'prop-types'
import { withSelectedItem } from '../hocs/withSelectedItem'

class Chart extends Component {
  static propTypes = {
    exchange: PropTypes.string,
    selectedItem: PropTypes.object,
  }

  static defaultProps = {
    exchange: 'POLONIEX',
  }

  getSymbol = () => {
    const pairReversed = this.props.selectedItem.pair.split('_').reverse().join('')
    return `${this.props.exchange.toUpperCase()}:${pairReversed.toUpperCase()}`
  }

  render() {
    if (!this.props.selectedItem.pair) return null
    return (
      <div style={{ height: '35rem' }}>
        <TradingViewWidget
          symbol={this.getSymbol()}
          autosize
          locale="pt"
          timezone="America/Sao_Paulo"
          hide_side_toolbar={false}
        />
      </div>
    )
  }
}

export default withSelectedItem(Chart)
