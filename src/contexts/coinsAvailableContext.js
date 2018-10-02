import React, { Component } from 'react'
import PropTypes from 'prop-types'
import API from '../api'

const CoinsAvailbleContext = React.createContext()

export class CoinsAvailbleProvider extends Component {
  static propTypes = {
    children: PropTypes.any,
  }

  state = {
    coinsAvailable: {},
  }

  componentWillUnmount() {
    clearInterval(this.coinsAvailableInterval)
  }

  componentDidMount() {
    this.coinsAvailableInterval = setInterval(this.fetchCoinsAvailble, 1000)
  }

  fetchCoinsAvailble = () => {
    API.fetchCoinsAvailble().then(res => {
      this.setState({ coinsAvailable: res })
    })
  }

  render() {
    const { children } = this.props

    return (
      <CoinsAvailbleContext.Provider
        value={{
          coinsAvailable: this.state.coinsAvailable,
        }}
      >
        {children}
      </CoinsAvailbleContext.Provider>
    )
  }
}

export const CoinsAvailbleConsumer = CoinsAvailbleContext.Consumer
