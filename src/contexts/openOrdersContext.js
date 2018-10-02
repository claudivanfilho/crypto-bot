import React, { Component } from 'react'
import PropTypes from 'prop-types'
import API from '../api'

const OpenOrdersContext = React.createContext()

export class OpenOrdersProvider extends Component {
  static propTypes = {
    children: PropTypes.any,
  }

  state = {
    openOrders: {},
  }

  componentWillUnmount() {
    clearInterval(this.openOrdersInterval)
  }

  componentDidMount() {
    this.openOrdersInterval = setInterval(this.fetchOpenOrders, 1000)
  }

  fetchOpenOrders = () => {
    API.fetchOpenOrders().then(res => {
      this.setState({ openOrders: res })
    })
  }

  render() {
    const { children } = this.props

    return (
      <OpenOrdersContext.Provider
        value={{
          openOrders: this.state.openOrders,
        }}
      >
        {children}
      </OpenOrdersContext.Provider>
    )
  }
}

export const OpenOrdersConsumer = OpenOrdersContext.Consumer
