const { db } = require('../../firebase')
const { functions } = require('../config')
const sendEmailTemplate = require('../mailjet/send-email-template')

const clientChatTemplate = functions.config().email_templates.client_chat
const coachChatTemplate = functions.config().email_templates.coach_chat

const numMinutes = 5
module.exports = functions.pubsub
  .schedule(`every ${numMinutes} minutes`)
  .onRun(async () => {
    const notificationsQuery = await db
      .collectionGroup('notifications')
      .where('type', '==', 'chat-notification')
      .where('emailSentAt', '==', null)
      .where('seenAt', '==', null)
      .get()

    const notifications = notificationsQuery.docs.map(doc => {
      return {
        ...doc.data(),
        ref: doc.ref,
        userId: doc.ref.parent.parent.id,
      }
    })

    const promises = notifications.map(notification =>
      notification.ref.update({ emailSentAt: new Date() })
    )
    const notificationsGroupedByUserChat = userNotificationGroups(notifications) // Filter notfications to user chats

    notificationsGroupedByUserChat.forEach(async notificationGroup => {
      const userDocs = await db.getAll(
        db.collection('users').doc(notificationGroup.userId),
        db.collection('users').doc(notificationGroup.from)
      )
      const [toUser, fromUser] = userDocs.map(doc => doc.data())

      const userFullName = `${toUser.firstName} ${toUser.lastName}`
      const template =
        toUser.role === 'coach' ? coachChatTemplate : clientChatTemplate

      promises.push(
        sendEmailTemplate(toUser.email, userFullName, template, {
          fromFirstName: fromUser.firstName,
          fromLastName: fromUser.lastName,
          toFirstName: toUser.firstName,
        })
      )
    })

    return Promise.all(promises)
  })

function userNotificationGroups(notifications) {
  var seen = {}
  return notifications.filter(notification => {
    const key = `${notification.userId}-${notification.chatId}`
    return seen.hasOwnProperty(key) ? false : (seen[key] = true)
  })
}
