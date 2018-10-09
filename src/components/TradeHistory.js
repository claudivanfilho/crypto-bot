import React, { Component } from 'react'
import { TradeHistoryConsumer } from '../contexts/tradeHistoryContext'
import PropTypes from 'prop-types'
import Moment from 'react-moment'
import 'moment-timezone'
import moment from 'moment'

class CoinsAvailable extends Component {
  static propTypes = {
    tradeHistory: PropTypes.array,
  }

  getDate(date) {
    const utcOffset = moment().utcOffset()
    const d = moment(`${date} +0000`, 'YYYY-MM-DD HH:mm:ss Z')
    d.utcOffset(utcOffset)
    return d.valueOf()
  }

  render() {
    if (!this.props.tradeHistory.length) return null
    return (
      <div>
        <div className="flex justify-between">
          <span className="w-33 flex justify-start pl4">Date</span>
          <span className="w-33 flex justify-start">Price</span>
          <span className="w-33 flex justify-start">Total</span>
        </div>
        <div className="overflow-y-auto overflow-x-hidden" style={{ height: '20rem' }}>
          <table className="ui gray unstackable table ma0">
            <tbody>
              {this.props.tradeHistory.map(transaction => (
                <tr
                  className={`f6 ${transaction.type === 'sell' ? 'negative' : 'positive'}`}
                  key={transaction.globalTradeID}
                >
                  <td className="w-33">
                    <Moment fromNow>
                      {this.getDate(transaction.date)}
                    </Moment>
                  </td>
                  <td className="w-33">{transaction.rate}</td>
                  <td className="w-33">{transaction.total}</td>
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
