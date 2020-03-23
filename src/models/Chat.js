import { db } from '@/firebase'

export default class Chat {
  createdAt
  id
  lastMessage
  messages
  notifications
  otherParticipant
  participants
  ref

  constructor(data, uid) {
    Object.assign(this, data)
    this.messages = []
    this._getOtherParticipant(uid)
    if (this.id) this._listenForMessages()
  }

  _listenForMessages() {
    this.ref
      .collection('messages')
      .orderBy('createdAt', 'desc')
      .onSnapshot(query => {
        this.messages = query.docs.map(doc => {
          return {
            id: doc.id,
            ...doc.data(),
          }
        })
      })
  }

  _getOtherParticipant(uid) {
    const otherParticipantId = this.participants.find(id => id != uid)
    return db
      .collection('userProfiles')
      .doc(otherParticipantId)
      .get()
      .then(doc => {
        this.otherParticipant = {
          id: doc.id,
          ...doc.data(),
        }
      })
  }

  newMessage(content, from) {
    return this.ref.collection('messages').add({
      createdAt: new Date(),
      content: content,
      from: from,
    })
  }

  markAsSeen() {
    if (this.notifications) {
      this.notifications.forEach(notification => {
        notification.markAsSeen()
      })
    }
  }
}
