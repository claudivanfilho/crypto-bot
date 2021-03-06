import React, { Component } from 'react'
import PropTypes from 'prop-types'
import API from '../api'
import { SelectedItemConsumer } from './selectedItemContext'
import { equals } from 'ramda'

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
    const promise = this.fetchOrderBook()
    promise && promise.then(() => {
      this.orderBookInterval = setInterval(this.fetchOrderBook, 1000)
    })
  }

  fetchOrderBook = () => {
    if (this.props.pair) {
      return API.fetchOrderBook({ deep: 25, pair: this.props.pair }).then(res => {
        if (!equals(this.state.orderBook, res)) {
          this.setState({ orderBook: res })
        }
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
