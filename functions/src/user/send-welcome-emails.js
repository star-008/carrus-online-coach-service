const { functions } = require('../config')

const sendEmailTemplate = require('../mailjet/send-email-template')

const clientWelcomeTemplateId = functions.config().email_templates
  .client_welcome
const coachWelcomeTemplateId = functions.config().email_templates.coach_welcome

module.exports = functions.firestore
  .document('/users/{userId}')
  .onWrite((change, context) => {
    const before = change.before
    const data = change.after.data()
    const email = data.email
    const toName = data.firstName + ' ' + data.lastName

    if (data.role === 'seeker' && !before.exists) {
      // Seeker on create
      return sendEmailTemplate(email, toName, clientWelcomeTemplateId, {
        name: data.firstName,
      })
    }

    if (
      data.role === 'coach' &&
      before.data().accountVerified === false &&
      data.accountVerified === true
    ) {
      // Coach on approved
      return sendEmailTemplate(email, toName, coachWelcomeTemplateId, {
        name: data.firstName,
      })
    }

    return 'No email sent'
  })
