import React, { Component } from 'react'
import PropTypes from 'prop-types'
import API from '../api'
import { SelectedItemConsumer } from './selectedItemContext'

const OrderBookContext = React.createContext()

class OrderBookProviderClass extends Component {
  static propTypes = {
    children: PropTypes.any,
    pair: PropTypes.string,
  }

  state = {
    orderBook: {},
  }

  componentWillUnmount() {
    clearInterval(this.orderBookInterval)
  }

  componentDidMount() {
    this.orderBookInterval = setInterval(this.fetchOrderBook, 1000)
  }

  fetchOrderBook = () => {
    if (this.props.pair) {
      API.fetchOrderBook({ deep: 15, pair: this.props.pair }).then(res => {
        this.setState({ orderBook: res })
      })
    }
  }

  render() {
    const { children } = this.props

    return (
      <OrderBookContext.Provider
        value={{
          orderBook: this.state.orderBook,
        }}
      >
        {children}
      </OrderBookContext.Provider>
    )
  }
}

export const OrderBookProvider = (props) => (
  <SelectedItemConsumer.Consumer>
    {({ selectedItem }) => (
      <OrderBookProviderClass {...props} pair={selectedItem.pair}>
        {
          // eslint-disable-next-line
          props.children
        }
      </OrderBookProviderClass>
    )}
  </SelectedItemConsumer.Consumer>
)

export const OrderBookConsumer = OrderBookContext.Consumer
