const { mailjet, functions } = require('../config')

module.exports = functions.firestore
  .document('/users/{userId}')
  .onCreate(async (doc, context) => {
    const data = doc.data()

    await mailjet
      .post('contact')
      .request({ Email: data.email })
      .catch(() => {})

    await mailjet
      .put('contactdata')
      .id(data.email)
      .request({
        Data: [
          {
            Name: 'firstname',
            value: data.firstName,
          },
          {
            Name: 'lastname',
            value: data.lastName,
          },
          {
            Name: 'role',
            value: data.role,
          },
          {
            Name: 'type',
            value: data.type,
          },
        ],
      })

    return mailjet
      .post('contact')
      .id(data.email)
      .action('managecontactslists')
      .request({
        ContactsLists: [{ ListID: '10199692', Action: 'addnoforce' }],
      })
  })
