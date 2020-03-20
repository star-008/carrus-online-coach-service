const { db } = require('../../firebase')
const { functions } = require('../config')

module.exports = functions.firestore
  .document('/orders/{orderId}/transactions/{transactionId}')
  .onUpdate(async (change, context) => {
    const { rating, review, seekerId, coachId, item } = change.after.data()

    const addReview = db
      .collection('users')
      .doc(coachId)
      .collection('reviews')
      .add({
        rating,
        review,
        seekerId,
        item,
        createdAt: new Date(),
      })

    const coachTransaction = db.runTransaction(transaction => {
      const ref = db.collection('users').doc(coachId)

      return transaction.get(ref).then(coachDoc => {
        if (!coachDoc.exists) throw 'Document does not exist!'

        const coach = coachDoc.data()
        const oldRating = coach.rating || 0
        const numRatings = coach.numRatings || 0

        transaction.update(ref, {
          rating: (oldRating * numRatings + rating) / (numRatings + 1),
          numRatings: numRatings + 1,
        })
      })
    })

    return Promise.all([addReview, coachTransaction])
  })
