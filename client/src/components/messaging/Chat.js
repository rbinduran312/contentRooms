import React from 'react';
import { connect } from 'react-redux';
import {
  SendBirdProvider,
  ChannelList,
  Channel,
  ChannelSettings,
} from 'sendbird-uikit';
import 'sendbird-uikit/dist/index.css';

import getCustomPaginatedQuery from './CustomUserList';

class Chat extends React.Component {
  constructor() {
    super();

    this.state = {
      user: {},
      currentChannelUrl: '',
      showSettings: false
    }

    this.loadStateFromProps = this.loadStateFromProps.bind(this);
    this.setCurrentChannelUrl = this.setCurrentChannelUrl.bind(this);
    this.setShowSettings = this.setShowSettings.bind(this);
  }

  componentDidMount() {
    this.loadStateFromProps();
  }

  componentDidUpdate(prevProps) {
    if (JSON.stringify(prevProps.auth) !== JSON.stringify(this.props.auth)) {
      this.loadStateFromProps();
    }
  }

  loadStateFromProps() {
    if (this.props.auth) {
      this.setState({ user: { ...this.props.auth.user } });
    }
  }

  setCurrentChannelUrl(url) {
    this.setState({ currentChannelUrl: url });
  }

  setShowSettings(bool) {
    this.setState({ showSettings: bool });
  }

  render() {
    return (
      <div style={{ height: '100vh' }}>
        <SendBirdProvider
          appId={process.env.REACT_APP_SENDBIRD_APP_ID}
          userId={this.state.user._id}
          nickname={this.state.user.name}
          discoveryKeys={[this.state.user._id]}
          friendDiscoveryKey={this.state.user._id}
          friendName={this.state.user.name}
          userListQuery={() => getCustomPaginatedQuery(this.state.user._id)}
        >
          <div className="sendbird-app__wrap">
            <div className="sendbird-app__channellist-wrap">
              <ChannelList
                onChannelSelect={(channel) => {
                  if (channel && channel.url) {
                    this.setCurrentChannelUrl(channel.url);
                  }
                }}
              />
            </div>
            <div className="sendbird-app__conversation-wrap">
              <Channel
                channelUrl={this.state.currentChannelUrl}
                onChatHeaderActionClick={() => { this.setShowSettings(true); }}
              />
            </div>
            {this.state.showSettings && (
              <div className="sendbird-app__settingspanel-wrap">
                <ChannelSettings
                  channelUrl={this.state.currentChannelUrl}
                  onCloseClick={() => { this.setShowSettings(false); }}
                />
              </div>
            )}
          </div>
        </SendBirdProvider>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps)(Chat);