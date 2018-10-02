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

  updateSelectedItem = (item) => {
    this.setState({ selectedItem: item })
  }

  render() {
    const { children } = this.props

    return (
      <SelectedItemContext.Provider
        value={{
          selectedItem: this.state.selectedItem,
          updateSelectedItem: this.updateSelectedItem,
        }}
      >
        {children}
      </SelectedItemContext.Provider>
    )
  }
}

export const SelectedItemConsumer = SelectedItemContext.Consumer
