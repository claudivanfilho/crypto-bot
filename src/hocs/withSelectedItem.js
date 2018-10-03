import React from 'react'
import { SelectedItemConsumer } from '../contexts/selectedItemContext'

export function withSelectedItem(WrappedComponent) {
  // ...and returns another component...
  return class ComponentWithSelectedItemContext extends React.Component {
    render() {
      return (
        <SelectedItemConsumer>
          {({ setSelectedItem, selectedItem }) => (
            <WrappedComponent
              setSelectedItem={setSelectedItem}
              selectedItem={selectedItem}
              {...this.props}
            />
          )}
        </SelectedItemConsumer>
      )
    }
  }
}
