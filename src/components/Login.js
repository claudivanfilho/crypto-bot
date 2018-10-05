import React, { Component } from 'react'
import API from '../api'
import PropTypes from 'prop-types'
import { UserConsumer } from '../contexts/userContext'
import { withRouter } from 'react-router-dom'

class Login extends Component {
  static propTypes = {
    user: PropTypes.object,
    loading: PropTypes.bool,
    history: PropTypes.any,
  }

  state = {
    emailSent: false,
    email: '',
    code: '',
  }

  handleEmailChange = (evt) => this.setState({ email: evt.target.value })
  handleCodeChange = (evt) => this.setState({ code: evt.target.value })

  handleEnterWithoutLogin = () => API.enterWithoutLogin().then(() => (
    this.props.history.push('/')
  ))

  handleSendEmail = () => {
    if (this.state.email) {
      API.sendEmailCode(this.state.email)
        .then(() => this.setState({ emailSent: true }))
        .catch(err => console.log('err', err))
    }
  }

  handleSendCode = () => {
    if (this.state.code) {
      API.sendCode(this.state.code)
        .then(() => { this.props.history.push('/') })
        .catch(() => alert('Invalid or Expired Code'))
    }
  }

  renderSendEmail = () => (
    <div className="ui stacked segment">
      <div className="field">
        <div className="ui left icon input">
          <i className="user icon"></i>
          <input
            type="text"
            name="email"
            placeholder="E-mail address"
            onChange={this.handleEmailChange}
            value={this.state.email}
          />
        </div>
      </div>
      <div className="ui fluid large teal submit button" onClick={this.handleSendEmail}>
        Send Code to Email
      </div>
    </div>
  )

  renderSendCode = () => (
    <div className="ui stacked segment">
      <div className="field">
        <div className="ui left icon input">
          <i className="key icon"></i>
          <input
            type="text"
            name="code"
            placeholder="Verification Code"
            onChange={this.handleCodeChange}
            value={this.state.code}
          />
        </div>
      </div>
      <div className="ui fluid large teal submit button" onClick={this.handleSendCode}>
        Confirm Code
      </div>
      <div className="ui fluid large submit button mt3" onClick={this.handleSendEmail}>
        Resend Code
      </div>
    </div>
  )

  render() {
    if (!this.props.loading && this.props.user) window.location.assign('/')
    if (this.props.loading) return null
    return (
      <div className="w-100 h-100 absolute bg-near-white">
        <div className="ui middle aligned center aligned grid absolute h-100 w-100">
          <div className="column w-100 w-50-m w-30-l">
            <h2 className="ui teal image header">
              <div className="content">
                  Log In To Your Account
              </div>
            </h2>
            <form className="ui large form">
              {!this.state.emailSent ? this.renderSendEmail() : this.renderSendCode()}
            </form>
            <div className="ui message">
              <a className="pointer b f4" onClick={this.handleEnterWithoutLogin}>
                Sign In Without Login
              </a>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const LoginWithRouter = withRouter(Login)

export default function ComponentWithContext(props) {
  return (
    <UserConsumer>
      {({ user, loading }) => (
        <LoginWithRouter
          {...props}
          user={user}
          loading={loading} />
      )}
    </UserConsumer>
  )
}

