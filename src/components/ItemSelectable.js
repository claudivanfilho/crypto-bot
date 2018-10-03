import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withSelectedItem } from '../hocs/withSelectedItem'

class ItemSelectable extends Component {
  static propTypes = {
    item: PropTypes.object,
    children: PropTypes.any,
    selectedItem: PropTypes.object,
    setSelectedItem: PropTypes.func,
  }

  isSelectedItem = () => (
    this.props.selectedItem.pair && this.props.selectedItem.pair.toLowerCase() === this.props.item.pair.toLowerCase()
  )

  render() {
    return (
      <div onClick={() => this.props.setSelectedItem(this.props.item)}>
        {this.props.children(this.isSelectedItem())}
      </div>
    )
  }
}

export default withSelectedItem(ItemSelectable)

