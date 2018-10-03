import React, { Component, Fragment } from 'react'
import { OpenOrdersConsumer } from '../contexts/openOrdersContext'
import PropTypes from 'prop-types'
import ItemSelectable from './ItemSelectable'
import ordersIcon from '../images/order-icon.png'

class OpenOrders extends Component {
  static propTypes = {
    openOrders: PropTypes.object,
  }

  render() {
    const orders = [...this.props.openOrders.buy, ...this.props.openOrders.sell]
    // const orders = [{
    //   type: 'buy',
    //   orderNumber: 1,
    //   rate: '0.00002',
    //   pair: 'BTC_NXT',
    // }, {
    //   type: 'sell',
    //   orderNumber: 2,
    //   rate: '0.00003',
    //   pair: 'BTC_ETH',
    // }]
    return (
      <Fragment>
        <img height="26" src={ordersIcon} className="dn flex-ns mr3" />
        {orders.map(order => (
          <ItemSelectable key={order.pair} item={order}>
            {(_, isSelectedOrder) => (
              <button className={`mb3 mb0-ns f7 mr3 ui button 
                ${isSelectedOrder ? '' : 'basic'} 
                ${order.type === 'buy' ? 'positive' : 'negative'}`
              }
              >
                {order.pair} - {order.rate}
              </button>
            )}
          </ItemSelectable>
        ))}
      </Fragment>
    )
  }
}

export default function ComponentWithContext(props) {
  return (
    <OpenOrdersConsumer>
      {({ openOrders }) => (
        <OpenOrders
          {...props}
          openOrders={openOrders} />
      )}
    </OpenOrdersConsumer>
  )
}
