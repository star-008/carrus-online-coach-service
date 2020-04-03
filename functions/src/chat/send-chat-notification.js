const { db } = require('../../firebase')
const { functions } = require('../config')

module.exports = functions.firestore
  .document('/chats/{chatId}/messages/{messageId}')
  .onCreate(async (snapshot, context) => {
    const chatId = context.params.chatId

    const messageData = snapshot.data()
    const from = messageData.from
    const createdAt = messageData.createdAt

    const chatDoc = await db
      .collection('chats')
      .doc(chatId)
      .get()
    const otherUserId = chatDoc.data().participants.find(id => id !== from)

    return db
      .collection('users')
      .doc(otherUserId)
      .collection('notifications')
      .add({
        type: 'chat-notification',
        message: 'You have received a new message',
        chatId,
        from,
        createdAt,
        emailSentAt: null,
        seenAt: null,
      })
  })
