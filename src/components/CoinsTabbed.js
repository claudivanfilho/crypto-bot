import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'

import { withTicker } from '../hocs/withTicker'
import CoinsTable from './CoinsTable'

class Ticker extends Component {
  static propTypes = {
    ticker: PropTypes.object,
  }

  static defaultProps = {
    ticker: {},
  }

  state = {
    activeTab: 'BTC',
  }

  get tabs() {
    return Object.keys(this.props.ticker)
  }

  handleTabChange = (tab) => this.setState({ activeTab: tab })

  render() {
    if (!this.props.ticker) return null
    return (
      <Fragment>
        <div className="ui top attached tabular menu">
          {
            this.tabs.map(tab => (
              <div
                key={tab}
                className={`item pointer dim
                  ${this.state.activeTab === tab ? 'active' : ''}
                `}
                onClick={() => this.handleTabChange(tab)}
              >
                {tab}
              </div>
            ))
          }
        </div>
        {
          this.tabs.map(tab => (
            <div
              key={tab}
              className={`ui bottom attached tab segment overflow-y-auto
                ${this.state.activeTab === tab ? 'active' : ''}`
              }
            >
              <CoinsTable coins={this.props.ticker[tab]} />
            </div>
          ))
        }
      </Fragment>
    )
  }
}

export default withTicker(Ticker)
