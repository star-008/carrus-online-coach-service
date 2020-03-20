const { db } = require('../../firebase')
const { anyIsEmpty } = require('../helpers')
const { functions } = require('../config')

const checkProfileCompletion = (data, uid) => {
  const filledOutKeys = Object.entries(data)
    .filter(([key, val]) => !anyIsEmpty(val))
    .map(([key, val]) => key)

  const compulsoryKeys = [
    { value: 'profileImage', text: 'Profile Image' },
    { value: 'firstName', text: 'First Name' },
    { value: 'lastName', text: 'Last Name' },
    { value: 'tagline', text: 'Tagline' },
    { value: 'rate', text: 'Rate' },
    { value: 'description', text: 'Description' },
    { value: 'timezone', text: 'Timezone' },
    { value: 'languages', text: 'Languages' },
    { value: 'coachingExpertise', text: 'Coaching Expertise' },
    { value: 'industryExpertise', text: 'Industry Expertise' },
  ]

  const incompleteProfileFields = compulsoryKeys
    .filter(key => !filledOutKeys.includes(key.value))
    .map(key => key.text)

  return db.doc(`users/${uid}`).update({
    incompleteProfileFields,
    profileComplete: incompleteProfileFields.length === 0,
  })
}

const setHasPublished = uid => {
  return db.doc(`userProfiles/${uid}`).update({ hasPublished: true })
}

const updateStandardPackageRate = (rate, uid) => {
  return db.doc(`users/${uid}/packages/standard`).update({ price: rate })
}

// Deployable Functions

const profileOnWrite = functions.firestore
  .document('userProfiles/{userId}')
  .onWrite(async (change, context) => {
    const existingData = change.before.data()
    const data = change.after.data()
    const uid = context.params.userId

    if (!existingData) return null

    if (data.role === 'coach') {
      await checkProfileCompletion(data, uid)

      const newRate = data.rate || 0
      await updateStandardPackageRate(newRate, uid)

      if (!existingData.hasPublished && data.public) await setHasPublished(uid)
    }

    return null
  })

const syncUserProfile = functions.firestore
  .document('/users/{userId}')
  .onWrite((change, context) => {
    const userId = context.params.userId
    const data = change.after.data()

    let lastName = data.lastName || ''
    lastName = data.role === 'seeker' ? lastName.slice(0, 1) : lastName

    const profileData = {
      firstName: data.firstName || '',
      lastName,
      profileImage: data.profileImage || {},
      timezone: data.timezone || {},
      role: data.role || 'seeker',
      projects: data.projects || [],
      companyName: data.companyName || '',
      type: data.type || 'individual',
      updatedAt: new Date(),
    }

    if (data.role === 'coach') {
      profileData.numRatings = data.numRatings || 0
      profileData.rating = data.rating || 0
      profileData.numSessions = data.numSessions || 0
      profileData.numPackages = data.numPackages || 0
      profileData.certified = data.certified || false
    }

    if (!change.before.exists)
      return db
        .collection('userProfiles')
        .doc(userId)
        .set(profileData) // Created

    return db
      .collection('userProfiles')
      .doc(userId)
      .update(profileData) // Updates
  })

module.exports = {
  profileOnWrite,
  syncUserProfile,
}
