import React, { Component } from 'react'
import PropTypes from 'prop-types'
import API from '../api'

const RobotsContext = React.createContext()

export class RobotsProvider extends Component {
  static propTypes = {
    children: PropTypes.any,
  }

  state = {
    robots: {},
  }

  componentDidMount() {
    this.fetchRobots()
  }

  fetchRobots = () => {
    API.fetchRobots().then(res => {
      this.setState({ robots: res })
    })
  }

  updateRobot = (data) => {
    API.updateRobot(data).then(() => {
      this.fetchRobots()
    })
  }

  render() {
    const { children } = this.props

    return (
      <RobotsContext.Provider
        value={{
          robots: this.state.robots,
          updateRobot: this.updateRobot,
        }}
      >
        {children}
      </RobotsContext.Provider>
    )
  }
}

export const RobotsConsumer = RobotsContext.Consumer
