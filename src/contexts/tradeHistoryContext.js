import React, { Component } from 'react'
import PropTypes from 'prop-types'
import API from '../api'
import { SelectedItemConsumer } from './selectedItemContext'

const TradeHistoryContext = React.createContext()

class TradeHistoryProviderClass extends Component {
  static propTypes = {
    children: PropTypes.any,
    pair: PropTypes.string,
    start: PropTypes.number,
    end: PropTypes.number,
  }

  state = {
    tradeHistory: {},
  }

  componentWillUnmount() {
    clearInterval(this.tradeHistoryInterval)
  }

  componentDidMount() {
    this.tradeHistoryInterval = setInterval(this.fetchTradeHistory, 1000)
  }

  fetchTradeHistory = () => {
    if (this.props.pair) {
      API.fetchTradeHistory({
        pair: this.props.pair,
        start: this.props.start,
        end: this.props.end,
      }).then(res => {
        this.setState({ tradeHistory: res })
      })
    }
  }

  render() {
    const { children } = this.props

    return (
      <TradeHistoryContext.Provider
        value={{
          tradeHistory: this.state.tradeHistory,
        }}
      >
        {children}
      </TradeHistoryContext.Provider>
    )
  }
}

export const TradeHistoryProvider = (props) => (
  <SelectedItemConsumer.Consumer>
    {({ selectedItem }) => (
      <TradeHistoryProviderClass {...props} pair={selectedItem.pair}>
        {
          // eslint-disable-next-line
          props.children
        }
      </TradeHistoryProviderClass>
    )}
  </SelectedItemConsumer.Consumer>
)

export const TradeHistoryConsumer = TradeHistoryContext.Consumer
