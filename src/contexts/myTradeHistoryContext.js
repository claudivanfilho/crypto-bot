import React, { Component } from 'react'
import PropTypes from 'prop-types'
import API from '../api'

const MyTradeHistoryContext = React.createContext()

export class MyTradeHistoryProvider extends Component {
  static propTypes = {
    children: PropTypes.any,
  }

  state = {
    myTradeHistory: {},
  }

  componentWillUnmount() {
    clearInterval(this.myTradeHistoryInterval)
  }

  componentDidMount() {
    this.myTradeHistoryInterval = setInterval(this.fetchMyTradeHistory, 1000)
  }

  fetchMyTradeHistory = () => {
    API.fetchMyTradeHistory().then(res => {
      this.setState({ myTradeHistory: res })
    })
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

export const MyTradeHistoryConsumer = MyTradeHistoryContext.Consumer
