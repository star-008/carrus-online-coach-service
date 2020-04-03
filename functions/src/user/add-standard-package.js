const { db } = require('../../firebase')
const { functions } = require('../config')

module.exports = functions.firestore
  .document('/users/{userId}')
  .onCreate((snapshot, context) => {
    const userId = context.params.userId
    const data = snapshot.data()

    if (data.role !== 'coach') return null

    return db
      .collection('users')
      .doc(userId)
      .collection('packages')
      .doc('standard')
      .set({
        title: 'Standard Hourly Coaching',
        description: '',
        price: 0,
        type: 'hourly',
        createdAt: new Date(),
      })
  })
