import React, { Component } from 'react'
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import chatReducer from './redux/ChatReducer';
// import logo from './logo.svg'
import Chat from '../src/components/Chat/Chat'

const store = createStore(chatReducer);
window.store = store;

class App extends Component {

  render() {
    return (
      <Provider store={ store }>
        <Chat />
      </Provider>
    )
  }
}

export default App
