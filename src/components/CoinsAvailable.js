import React, { Component } from 'react'
import { CoinsAvailableConsumer } from '../contexts/coinsAvailableContext'
import PropTypes from 'prop-types'

class CoinsAvailable extends Component {
  static propTypes = {
    coinsAvailable: PropTypes.array,
  }

  render() {
    if (!this.props.coinsAvailable) return <div>Loading</div>
    return this.props.coinsAvailable.map(coin => (
      <div key={coin.coinName} className="ui labeled button" tabIndex="0">
        <div className="ui green button f6">
          {coin.coinName}
          {/* <i className="heart icon"></i> Like */}
        </div>
        <a className="ui basic breen left pointing label f6">
          {coin.btcValue}
        </a>
      </div>
    ))
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
