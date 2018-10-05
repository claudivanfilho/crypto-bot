import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { withRouter } from 'react-router-dom'

class NotFound extends Component {
  static propTypes = {
    history: PropTypes.any,
  }

  handleGoToHome = () => this.props.history.push('/')

  render() {
    return (
      <div className="w-100 flex flex-column items-center justify-center">
        <h2 className="ma0 mb4 mt6">Not Found Page</h2>
        <a className="f3 pointer" onClick={this.handleGoToHome}>Go To Home</a>
      </div>
    )
  }
}

export default withRouter(NotFound)

