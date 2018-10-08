import React from 'react'
import { UserConsumer } from '../contexts/userContext'

export function withUser(WrappedComponent) {
  // ...and returns another component...
  return class ComponentWithContext extends React.Component {
    render() {
      return (
        <UserConsumer>
          {({ fetchUser, user }) => (
            <WrappedComponent
              fetchUser={fetchUser}
              user={user}
              {...this.props}
            />
          )}
        </UserConsumer>
      )
    }
  }
}
