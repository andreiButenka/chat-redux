import React, { Component } from 'react'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import NameInput from '../NameInput/NameInput'
import ChatInput from '../ChatInput/ChatInput'
import ChatMessage from '../ChatMessage/ChatMessage'
import DraftMessage from '../DraftMessage/DraftMessage'
import Notification  from '../Notification/Notification';
import ChatHeader from '../ChatHeader/ChatHeader';
import { 
  setConnectionStatusOnline, 
  setConnectionStatusOffline, 
  addMessage, addDraftMessage, 
  deleteDraftMessage, 
  resendDraftMessage, 
  turnNotificationsOff, 
  turnNotificationsOn, 
  showNotification 
} from '../../redux/ChatActions';
import { MDBCard, MDBCardBody, MDBRow, MDBCol, MDBListGroup } from "mdbreact";
import './Chat.css'

const URL = 'wss://wssproxy.herokuapp.com/'

class Chat extends Component {

  ws = new WebSocket(URL)

  componentDidMount() {
    this.handleConnectionChange();
    window.addEventListener('online', this.handleConnectionChange);
    window.addEventListener('offline', this.handleConnectionChange);
    this.connect()
  }

  componentWillUnmount() {
    window.removeEventListener('online', this.handleConnectionChange);
    window.removeEventListener('offline', this.handleConnectionChange);
  }

  connect = () => {
    this.ws.onopen = () => {
      this.props.setConnectionStatusOnline()
    }
    this.ws.onmessage = evt => {
      let message = JSON.parse(evt.data)
      
      if (Array.isArray(message) && message.length === 1 && typeof message[0] === 'object') {
        message = message[0]
        this.handleNotification(message.from, message.message)
      }
      this.props.addMessage(message)
      
    }
    this.ws.onclose = () => {
      this.props.setConnectionStatusOffline()
      this.ws = new WebSocket(URL)
      this.connect()
    }
  }

  handleConnectionChange = () => {
    let wbStatus = this.ws.readyState;
    const condition = navigator.onLine ? 'online' : 'offline';
    if (condition === 'online') {
      const webPing = setInterval(
        () => {
          fetch('//google.com', {
            mode: 'no-cors',
            })
          .then(() => {
            if (wbStatus === WebSocket.OPEN) {
              this.props.setConnectionStatusOnline()
              clearInterval(webPing)
            }
          }).catch(() => this.props.setConnectionStatusOffline() )
        }, 2000);
      return;
    }
    if (this.ws.readyState === WebSocket.OPEN) {
      return this.props.setConnectionStatusOffline();
    }
  }

  submitMessage = messageString => {
    const message = { from: this.props.chat.from, message: messageString }
    if (this.props.chat.status !== 'online') {
      this.props.addDraftMessage(message);
      return
    }
    this.ws.send(JSON.stringify(message))
  }

  closeConnection = () => {
    this.ws.close()
  }

  openConnection = () => {
    this.ws = new WebSocket(URL)
    this.connect()
  }

  resendDraftMessage = (e) => {
    const key = e.target.parentNode.id;
    this.props.chat.draftMessages.forEach((draftMessage, index) => {
      if (index === Number(key) && this.props.chat.status === 'online') {
        this.ws.send(JSON.stringify(draftMessage))
        this.props.resendDraftMessage(key);
      }
    })
  }

  deleteDraftMessage = (e) => {
    const key = e.target.parentNode.id;
    this.props.deleteDraftMessage(key)
  }

  handlePermissionGranted(){
    this.props.turnNotificationsOn();
  }

  handlePermissionDenied(){
    this.props.turnNotificationsOff();
  }

  handleNotSupported(){
    this.props.turnNotificationsOff();
  }

  handleNotificationOnError(e, tag) {
    console.log(e, 'Notification error tag:' + tag);
  }

  switchNotifications() {
    if (this.props.chat.ignore === false) {
      this.props.turnNotificationsOff();
      return;
    }  
    this.props.turnNotificationsOn();
  }

  handleNotification(from, message) {

    if (this.props.chat.ignore) {
      return;
    }

    const now = Date.now();
    const title = this.props.chat.title;
    const body = `${from}: ${message}`;
    const tag = now;
    const options = {
      tag: tag,
      body: body,
      lang: 'en',
      dir: 'ltr',
    }
    this.props.showNotification(title, options);
    this.setState({
      title: title,
      options: options
    });
  }

  render() {
    return (
      <div className="grey darken-3">
        <Notification
          ignore={this.props.chat.ignore && this.props.chat.title !== ''}
          notSupported={this.handleNotSupported.bind(this)}
          onPermissionGranted={this.handlePermissionGranted.bind(this)}
          onPermissionDenied={this.handlePermissionDenied.bind(this)}
          onError={this.handleNotificationOnError.bind(this)}
          timeout={5000}
          title={this.props.chat.title}
          options={this.props.chat.options}
          disableActiveWindow={true}
        />
        <ChatHeader 
          closeConnection={this.closeConnection.bind(this)}
          openConnection={this.openConnection.bind(this)}
          switchNotifications={this.switchNotifications.bind(this)}
        />
        <MDBCard className="chat-room blue-grey lighten-5">
          <MDBCardBody className="justify-content-center">
            <MDBRow className="justify-content-center">
              <MDBCol md="8" xl="6" className="pl-md-3 mt-4 mt-md-0 px-lg-12">
                <NameInput />         
              </MDBCol>
            </MDBRow>
            <MDBRow className="justify-content-center">
              <MDBCol md="8" xl="6" className="pl-md-3 mt-4 mt-md-0 px-lg-12">
                <MDBListGroup className="indigo lighten-5 list-unstyled pl-3 pr-3">
                  {this.props.chat.draftMessages.map((message, index) => {
                    return (
                      <DraftMessage
                        key={index}
                        id={index}
                        message={message.message}
                        name={message.from}
                        className="justify-content-end draft"
                        close={this.deleteDraftMessage}
                        resend={this.resendDraftMessage}
                      />
                    )
                  })}
                  {this.props.chat.messages.map((message, index) => {
                    let messageStatus = 'justify-content-between ordinary';
                    if (message.from === this.props.chat.from) {
                      messageStatus = 'justify-content-end active';
                    }
                    return (
                      <ChatMessage
                        key={message.id}
                        message={message.message}
                        name={message.from}
                        className={messageStatus}
                      />
                    )
                  })}  
                </MDBListGroup>
              </MDBCol>
            </MDBRow>
            <MDBRow className="justify-content-center">
              <ChatInput
                ws={this.ws}
                onSubmitMessage={messageString => this.submitMessage(messageString)}
              />
            </MDBRow>
          </MDBCardBody>
        </MDBCard>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  const { chat } = state
  return { chat }
};

const mapDispatchToProps = dispatch => (
  bindActionCreators({
    setConnectionStatusOnline, 
    setConnectionStatusOffline,
    addMessage,
    addDraftMessage,
    deleteDraftMessage,
    resendDraftMessage,
    turnNotificationsOff,
    turnNotificationsOn,
    showNotification
  }, dispatch)
);

export default connect(mapStateToProps, mapDispatchToProps)(Chat);

