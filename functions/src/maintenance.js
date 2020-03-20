const { db } = require('../firebase')
const { mailjet, functions } = require('./config')

// helper function to perform maintenance using in-built SDKs
module.exports = functions.https.onRequest(async () => {
  const snap = await db.collection('users').get()

  const contactPromises = []
  const dataPromises = []
  const subscribePromises = []
  snap.docs.forEach(doc => {
    const data = doc.data()
    contactPromises.push(mailjet.post('contact').request({ Email: data.email }))
    dataPromises.push(
      mailjet
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
    )
    subscribePromises.push(
      mailjet
        .post('contact')
        .id(data.email)
        .action('managecontactslists')
        .request({
          ContactsLists: [{ ListID: '10199692', Action: 'addnoforce' }],
        })
    )
  })

  await Promise.all(contactPromises).catch(() => {})
  await Promise.all(dataPromises)
  return Promise.all(subscribePromises)
})
