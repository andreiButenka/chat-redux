export const setConnectionStatusOnline = () => (
    {
      type: 'SET_CONNECTION_STATUS_ONLINE',
    }
  );

export const setConnectionStatusOffline = () => (
    {
      type: 'SET_CONNECTION_STATUS_OFFLINE',
    }
  );

export const addMessage = (message) => (
    {
      type: 'ADD_MESSAGE',
      payload: message,
    }
)

export const addDraftMessage = (message) => (
    {
      type: 'ADD_DRAFT_MESSAGE',
      payload: message,
    }
)

export const deleteDraftMessage = (key) => (
    {
      type: 'DELETE_DRAFT_MESSAGE',
      payload: key,
    }
)

export const resendDraftMessage = (key) => (
    {
      type: 'RESEND_DRAFT_MESSAGE',
      payload: key,
    }
)

export const changeName = (name) => (
    {
      type: 'CHANGE_NAME',
      payload: name,
    }
)

export const turnNotificationsOff = () => (
    {
      type: 'TURN_NOTIFICATIONS_OFF'
    }
)

export const turnNotificationsOn = () => (
    {
      type: 'TURN_NOTIFICATIONS_ON'
    }
)

export const showNotification = (title, options) => (
    {
      type: 'SHOW_NOTIFICATION',
      payload: [title, options],
    }
)

