import { combineReducers } from 'redux';

const INITIAL_STATE = {
    from: localStorage.getItem('userName'),
    messages: [],
    draftMessages: [],
    messageStatus: undefined,
    status: 'offline',
    statusBackground: 'alert alert-success',
    ignore: false,
    title: 'Chat notification!',
    switchNotificationButtonText: 'Turn notifications off'
};

const chatReducer = (state = INITIAL_STATE, action) => {
    let stateCopy = {
        ...state
    }
    
    switch (action.type) {
        case 'SET_CONNECTION_STATUS_ONLINE':
            stateCopy.status = 'online';
            stateCopy.statusBackground = 'alert alert-success';
            return stateCopy;
        case 'SET_CONNECTION_STATUS_OFFLINE':
            stateCopy.status = 'offline';
            stateCopy.statusBackground = 'alert alert-danger';
        return stateCopy;
        case 'ADD_MESSAGE':
            const message = action.payload;
            if (message.length > 1) {
                console.log('more')
                stateCopy.messages = message;
                return stateCopy;
            } else {
                console.log('1')
                stateCopy.messages = [message, ...stateCopy.messages];
                return stateCopy;
            }
        case 'ADD_DRAFT_MESSAGE':
            const draftMessage = action.payload;
            stateCopy.draftMessages = [draftMessage, ...stateCopy.draftMessages];
            return stateCopy;
        case 'DELETE_DRAFT_MESSAGE':
            const key = action.payload;
            stateCopy.draftMessages = stateCopy.draftMessages.filter((message, index) => index !== Number(key))
            return stateCopy;
        case 'RESEND_DRAFT_MESSAGE':
            const parentKey = action.payload;
            stateCopy.draftMessages = stateCopy.draftMessages.filter((message, index) => index !== Number(parentKey))
            return stateCopy;
        case 'CHANGE_NAME':
            const name = action.payload;
            stateCopy.from = name;
            return stateCopy;
        case 'TURN_NOTIFICATIONS_OFF':
            stateCopy.ignore = true;
            stateCopy.switchNotificationButtonText = 'Turn notification on';
            return stateCopy;
        case 'TURN_NOTIFICATIONS_ON':
            stateCopy.ignore = false;
            stateCopy.switchNotificationButtonText = 'Turn notification off';
            return stateCopy;
        case 'SHOW_NOTIFICATION':
            const title = action.payload[0];
            const options = action.payload[1];
            stateCopy.title = title;
            stateCopy.options = options;
            return stateCopy;
        default:
          return state;
      }
};

export default combineReducers({
  chat: chatReducer
});