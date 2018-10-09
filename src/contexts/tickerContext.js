import React, { Component } from 'react'
import PropTypes from 'prop-types'

import API from '../api'
import { equals } from 'ramda'

const TickerContext = React.createContext()

export class TickerProvider extends Component {
  static propTypes = {
    children: PropTypes.any,
  }

  state = {
    ticker: {},
  }

  componentWillUnmount() {
    clearInterval(this.tickerInterval)
  }

  componentDidMount() {
    this.fetchTicker().then(() => {
      this.tickerInterval = setInterval(this.fetchTicker, 3000)
    })
  }

  fetchTicker = () => (
    API.fetchTicker().then(res => {
      if (!equals(this.state.ticker, res)) {
        this.setState({ ticker: res })
      }
    })
  )

  render() {
    const { children } = this.props

    return (
      <TickerContext.Provider
        value={{
          ticker: this.state.ticker,
        }}
      >
        {children}
      </TickerContext.Provider>
    )
  }
}

export const TickerConsumer = TickerContext.Consumer
