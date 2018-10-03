import React, { Component } from 'react'
import PropTypes from 'prop-types'
import API from '../api'
import { equals } from 'ramda'

const CoinsAvailableContext = React.createContext()

export class CoinsAvailableProvider extends Component {
  static propTypes = {
    children: PropTypes.any,
  }

  state = {
    coinsAvailable: [],
  }

  componentWillUnmount() {
    clearInterval(this.coinsAvailableInterval)
  }

  componentDidMount() {
    this.coinsAvailableInterval = setInterval(this.fetchCoinsAvailable, 1000)
  }

  fetchCoinsAvailable = () => {
    API.fetchCoinsAvailable().then(res => {
      if (!equals(this.state.coinsAvailable, res) && Array.isArray(res)) {
        this.setState({ coinsAvailable: res })
      }
    })
  }

  render() {
    const { children } = this.props

    return (
      <CoinsAvailableContext.Provider
        value={{
          coinsAvailable: this.state.coinsAvailable,
        }}
      >
        {children}
      </CoinsAvailableContext.Provider>
    )
  }
}

export const CoinsAvailableConsumer = CoinsAvailableContext.Consumer
