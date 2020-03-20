const { db } = require('../../firebase')
const { functions } = require('../config')

const sendEmailTemplate = require('../mailjet/send-email-template')

const almostThere = functions.config().email_templates.coach_almost_there

module.exports = functions.pubsub.schedule('0 6 * * *').onRun(async () => {
  sendAfter(1)
  sendAfter(6)
  sendAfter(21)

  async function sendAfter(interval) {
    const now = new Date()
    const intervalDate = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() - interval,
      now.getHours()
    )
    const intervalDateMinusOneDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() - (interval + 1),
      now.getHours()
    )

    const snap = await db
      .collection('users')
      .where('role', '==', 'coach')
      .where('stripeAccount', '==', null)
      .where('accountVerified', '==', true)
      .where('createdAt', '>=', intervalDateMinusOneDay)
      .where('createdAt', '<', intervalDate)
      .get()

    const sendPromises = snap.docs.map(doc => {
      const data = doc.data()
      const fullName = data.firstName + ' ' + data.lastName
      return sendEmailTemplate(data.email, fullName, almostThere)
    })

    return await Promise.all(sendPromises)
  }
})
