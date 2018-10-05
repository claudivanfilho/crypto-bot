import React, { Component } from 'react'
import PropTypes from 'prop-types'
import API from '../api'
import { equals } from 'ramda'

const UserContext = React.createContext()

export class UserProvider extends Component {
  static propTypes = {
    children: PropTypes.any,
  }

  state = {
    user: null,
    loading: true,
  }

  componentDidMount() {
    this.fetchUser()
  }

  fetchUser = () => {
    API.fetchUser().then(res => {
      this.setState({ user: res, loading: false })
    }).catch(() => this.setState({ loading: false }))
  }

  render() {
    const { children } = this.props

    return (
      <UserContext.Provider
        value={{
          user: this.state.user,
          loading: this.state.loading,
        }}
      >
        {children}
      </UserContext.Provider>
    )
  }
}

export const UserConsumer = UserContext.Consumer
