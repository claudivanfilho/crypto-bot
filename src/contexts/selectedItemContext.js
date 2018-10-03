import React, { Component } from 'react'
import PropTypes from 'prop-types'

const SelectedItemContext = React.createContext()

export class SelectedItemProvider extends Component {
  static propTypes = {
    children: PropTypes.any,
  }

  state = {
    selectedItem: {},
  }

  setSelectedItem = (item) => (
    this.setState({ selectedItem: item })
  )

  render() {
    const { children } = this.props

    return (
      <SelectedItemContext.Provider
        value={{
          selectedItem: this.state.selectedItem,
          setSelectedItem: this.setSelectedItem,
        }}
      >
        {children}
      </SelectedItemContext.Provider>
    )
  }
}

export const SelectedItemConsumer = SelectedItemContext.Consumer
