const { db } = require('../../firebase')
const { functions } = require('../config')

module.exports = functions.firestore
  .document('chats/{chatId}/messages/{messageId}')
  .onCreate((snapshot, context) => {
    const data = snapshot.data()
    const chatId = context.params.chatId
    return db
      .collection('chats')
      .doc(chatId)
      .update({
        lastMessage: data,
      })
  })
