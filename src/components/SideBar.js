import React, { Component } from 'react'
import PropTypes from 'prop-types'

import TableIcon from '../icons/TableIcon'
import CoinIcon from '../icons/CoinIcon'
import RobotIcon from '../icons/RobotIcon'
import OrderIcon from '../icons/OrderIcon'
import LogoutIcon from '../icons/LogoutIcon'

import { withUser } from '../hocs/withUser'
import API from '../api'

const menus = [
  { Icon: OrderIcon, name: 'openOrders' },
  { Icon: RobotIcon, name: 'robots' },
  { Icon: CoinIcon, name: 'coinsAvailable' },
  { Icon: TableIcon, name: 'coinsTabbed' },
]

class SideBar extends Component {
  static propTypes = {
    visibilityItems: PropTypes.object,
    handleToogleItem: PropTypes.func,
    fetchUser: PropTypes.func,
  }

  render() {
    return (
      <div
        className="flex flex-row flex-column-ns items-center pt4 h-100 white w-100 justify-around justify-start-ns"
        style={{ backgroundColor: '#23262E' }}
      >
        {
          menus.map(({ Icon, name }) => (
            <div
              onClick={() => this.props.handleToogleItem(name)}
              key={name}
              className={`pa2 mv3 pointer 
                ${this.props.visibilityItems[name] ? '' : 'o-20'}
              `}
            >
              <Icon size={34} color="white" className="pa2" title={name} />
            </div>
          ))
        }
        <div
          onClick={() => API.logout().then(() => this.props.fetchUser())}
          className="pa2 mv3 pointer">
          <LogoutIcon
            title="Logout"
            size={28}
            color="white"
          />
        </div>
      </div>
    )
  }
}

export default withUser(SideBar)

