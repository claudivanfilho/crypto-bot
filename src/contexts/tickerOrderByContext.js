import React, { Component } from 'react'
import PropTypes from 'prop-types'

import OrderBy from '../constants/tickerOrderBy'

const TickerOrderByContext = React.createContext()

export class TickerOrderByProvider extends Component {
  static propTypes = {
    children: PropTypes.any,
  }

  state = {
    column: OrderBy.NAME.value,
    direction: 'ASC',
  }

  setOrderBy = (column, direction = 'ASC') => {
    let newDirection = direction
    if (this.state.column === column) {
      newDirection = this.state.direction === 'ASC' ? 'DESC' : 'ASC'
    }
    this.setState({ column, direction: newDirection })
  }

  sortCollection = (array) => {
    const newArray = [...array]
    newArray.sort(
      OrderBy[this.state.column][this.state.direction]
    )
    return newArray
  }

  render() {
    const { children } = this.props

    return (
      <TickerOrderByContext.Provider
        value={{
          setOrderBy: this.setOrderBy,
          sortCollection: this.sortCollection,
        }}
      >
        {children}
      </TickerOrderByContext.Provider>
    )
  }
}

export const TickerOrderByConsumer = TickerOrderByContext.Consumer
