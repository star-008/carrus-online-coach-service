const { env, functions } = require('../config')
const { db } = require('../../firebase')
const sanitizeHtml = require('sanitize-html');

const algoliasearch = require('algoliasearch')
const algolia = algoliasearch(
  functions.config().algolia.app_id,
  functions.config().algolia.admin_api_key
)
const coachesIndex = algolia.initIndex(
  `COACHES_${functions.config().project.name}_${env}`
)

const sanitizeDescription = (id, html) => {
  return db.doc(`userProfiles/${id}`).update({
    description: sanitizeHtml(html)
  })
}

module.exports = functions.firestore
  .document('/userProfiles/{userId}')
  .onWrite((change, context) => {
    // updateCoachesIndex({before: { cool: 'nool' }, after: { mool: 'tool' } }, {params: {coachId: 'zbl1VUPEXPXmoxmfUPTnhdwPH612'}})
    const objectID = context.params.userId
    const data = change.after.data()
    const beforeData = change.before.data()

    if (data.description) sanitizeDescription(objectID, data.description)

    if (data.role !== 'coach') return 'User is not coach'

    if (!change.after.exists) return coachesIndex.deleteObject(objectID) // doc deleted

    if (!data.public) {
      if (beforeData && beforeData.public)
        return coachesIndex.deleteObject(objectID) // publicity changed to invisible
      return 'Profile remains hidden'
    }

    return coachesIndex.saveObject({ objectID, ...data })
  })
