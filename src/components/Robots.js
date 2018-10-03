import React, { Component, Fragment } from 'react'
import { RobotsConsumer } from '../contexts/robotsContext'
import PropTypes from 'prop-types'
import ItemSelectable from './ItemSelectable'
import droid from '../images/droid.svg'

class Robots extends Component {
  static propTypes = {
    robots: PropTypes.array,
  }
  render() {
    return (
      <Fragment>
        <img height="26" src={droid} className="dn flex-ns mr3" />
        {this.props.robots.map(robot => (
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
