const { db } = require('../../firebase')
const { functions } = require('../config')

const updateNumPackages = functions.firestore
  .document('/users/{userId}/packages/{packageId}')
  .onWrite(async (change, context) => {
    const coachId = context.params.userId

    const packagesSnap = await db
      .collection('users')
      .doc(coachId)
      .collection('packages')
      .get()
    const numPackages = packagesSnap.docs.length

    return db
      .collection('users')
      .doc(coachId)
      .update({ numPackages })
  })

module.exports = {
  updateNumPackages,
}
