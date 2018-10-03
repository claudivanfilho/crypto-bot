import React, { Component } from 'react'
import PropTypes from 'prop-types'
import API from '../api'
import { SelectedItemConsumer } from './selectedItemContext'
import moment from 'moment'
import { equals } from 'ramda'

const ChartContext = React.createContext()

class ChartProviderClass extends Component {
  static propTypes = {
    children: PropTypes.any,
    pair: PropTypes.string,
  }

  state = {
    chartData: [],
    start: moment().subtract(90, 'day').startOf('day').unix(),
    end: moment().unix(),
    // periods 300, 900, 1800, 7200, 14400, and 86400
    period: 900,
  }

  componentWillUnmount() {
    clearInterval(this.chartDataInterval)
  }

  componentDidMount() {
    this.chartDataInterval = setInterval(this.fetchChart, 1000)
  }

  fetchChart = () => {
    if (this.props.pair) {
      API.fetchChart({
        pair: this.props.pair,
        start: this.state.start,
        end: this.state.end,
        period: this.state.period,
      }).then(res => {
        if (!equals(this.state.chartData, res)) {
          this.setState({ chartData: res })
        }
      })
    }
  }

  render() {
    const { children } = this.props

    return (
      <ChartContext.Provider
        value={{
          chartData: this.state.chartData,
        }}
      >
        {children}
      </ChartContext.Provider>
    )
  }
}

export const ChartProvider = (props) => (
  <SelectedItemConsumer.Consumer>
    {({ selectedItem }) => (
      <ChartProviderClass {...props} pair={selectedItem.pair}>
        {
          // eslint-disable-next-line
          props.children
        }
      </ChartProviderClass>
    )}
  </SelectedItemConsumer.Consumer>
)

export const ChartConsumer = ChartContext.Consumer
