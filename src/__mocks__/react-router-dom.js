import React, { Component } from 'react'
import { PropTypes } from 'prop-types'

/**
 * Link Mocked Component.
 */
export class Link extends Component {
  static propTypes = {
    children: PropTypes.any,
  }

  render() {
    return (
      <a href="#">{this.props.children}</a>
    )
  }
}

export class Route extends Component {
  static propTypes = {
    component: PropTypes.func,
  }

  render() {
    return <this.props.component />
  }
}
