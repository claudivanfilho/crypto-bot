import React, { Component } from 'react'
import PropTypes from 'prop-types'
import API from '../api'
import { SelectedItemConsumer } from './selectedItemContext'
import { equals } from 'ramda'

const MyTradeHistoryContext = React.createContext()

class MyTradeHistoryProviderClass extends Component {
  static propTypes = {
    children: PropTypes.any,
    pair: PropTypes.string,
  }

  state = {
    myTradeHistory: [],
  }

  componentWillUnmount() {
    clearInterval(this.myTradeHistoryInterval)
  }

  componentDidMount() {
    this.myTradeHistoryInterval = setInterval(this.fetchMyTradeHistory, 1000)
  }

  fetchMyTradeHistory = () => {
    if (this.props.pair) {
      API.fetchMyTradeHistory(this.props.pair).then(res => {
        if (!equals(this.state.myTradeHistory, res)) {
          this.setState({ myTradeHistory: res })
        }
      })
    }
  }

  render() {
    const { children } = this.props

    return (
      <MyTradeHistoryContext.Provider
        value={{
          myTradeHistory: this.state.myTradeHistory,
        }}
      >
        {children}
      </MyTradeHistoryContext.Provider>
    )
  }
}

export const MyTradeHistoryProvider = (props) => (
  <SelectedItemConsumer.Consumer>
    {({ selectedItem }) => (
      <MyTradeHistoryProviderClass {...props} pair={selectedItem.pair}>
        {
          // eslint-disable-next-line
          props.children
        }
      </MyTradeHistoryProviderClass>
    )}
  </SelectedItemConsumer.Consumer>
)

export const MyTradeHistoryConsumer = MyTradeHistoryContext.Consumer
