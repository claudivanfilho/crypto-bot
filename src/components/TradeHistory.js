import React, { Component } from 'react'
import { TradeHistoryConsumer } from '../contexts/tradeHistoryContext'
import PropTypes from 'prop-types'
import Moment from 'react-moment'

class CoinsAvailable extends Component {
  static propTypes = {
    tradeHistory: PropTypes.array,
  }

  render() {
    if (!this.props.tradeHistory.length) return null
    return (
      <div>
        <div className="flex justify-between">
          <span className="w-33 flex justify-start pl5">Date</span>
          <span className="w-33 flex justify-start pl5">Price</span>
          <span className="w-33 flex justify-start pl5">Total</span>
        </div>
        <div className="overflow-y-auto overflow-x-hidden" style={{ height: '30rem' }}>
          <table className="ui gray unstackable table ma0">
            <tbody>
              {this.props.tradeHistory.map(transaction => (
                <tr
                  className={`f6 ${transaction.type === 'sell' ? 'negative' : 'positive'}`}
                  key={transaction.globalTradeID}
                >
                  <td>
                    <Moment subtract={{ hours: 3 }} fromNow>{
                      transaction.date}
                    </Moment>
                  </td>
                  <td>{transaction.rate}</td>
                  <td>{transaction.total}</td>
                </tr>
              ))}
            </tbody>
          </table>

        </div>

      </div>
    )
    // return this.props.tradeHistory.map(coin => (
    //   <div key={coin.coinName} className="ui labeled button" tabIndex="0">
    //     <div className="ui green button f6">
    //       {coin.coinName}
    //       {/* <i className="heart icon"></i> Like */}
    //     </div>
    //     <a className="ui basic breen left pointing label f6">
    //       {coin.btcValue}
    //     </a>
    //   </div>
    // ))
  }
}

export default function ComponentWithContext(props) {
  return (
    <TradeHistoryConsumer>
      {({ tradeHistory }) => (
        <CoinsAvailable
          {...props}
          tradeHistory={tradeHistory}
        />
      )}
    </TradeHistoryConsumer>
  )
}
