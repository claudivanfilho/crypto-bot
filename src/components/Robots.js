import React, { Component, Fragment } from 'react'
import { RobotsConsumer } from '../contexts/robotsContext'
import PropTypes from 'prop-types'
import ItemSelectable from './ItemSelectable'

import RobotIcon from '../icons/RobotIcon'

class Robots extends Component {
  static propTypes = {
    robots: PropTypes.array,
  }
  render() {
    const { robots } = this.props
    // const robots = [{ pair: 'BTC_NXT' }]
    if (!Array.isArray(robots)) return null
    return (
      <Fragment>
        <RobotIcon size={26} className="dn flex-ns mr3" />
        {robots.map(robot => (
          <ItemSelectable key={robot.pair} item={robot}>
            {(isSelected) => (
              <button className={`mb3 mb0-ns f7 mr3 ui primary button ${isSelected ? '' : 'basic'}`}>
                {robot.pair}
              </button>
            )}
          </ItemSelectable>
        ))}
      </Fragment>
    )
  }
}

export default function ComponentWithContext(props) {
  return (
    <RobotsConsumer>
      {({ robots }) => (
        <Robots
          {...props}
          robots={robots} />
      )}
    </RobotsConsumer>
  )
}
