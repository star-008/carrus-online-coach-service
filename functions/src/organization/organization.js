const { functions } = require('../config')
const { db, admin } = require('../../firebase')
const { assertUID, assert, catchErrors } = require('../helpers')

const getOrganizationData = async organizationId => {
  const doc = await db.doc(`organizations/${organizationId}`).get()

  return doc.data()
}

const createStaffMember = (organizationId, userId, roles = []) => {
  const batch = db.batch()

  batch.create(db.doc(`organizations/${organizationId}/staff/${userId}`), {
    createdAt: new Date(),
    updatedAt: new Date(),
    roles,
    budget: 0,
    spent: 0,
  })

  batch.update(db.doc(`organizations/${organizationId}`), {
    participants: admin.firestore.FieldValue.arrayUnion(userId),
  })

  return batch.commit()
}

const deleteStaffMember = async (organizationId, userId) => {
  const { ownerId } = await getOrganizationData(organizationId)

  if (ownerId === userId) throw new Error('Cannot delete organization owner')

  const batch = db.batch()

  batch.delete(db.doc(`organizations/${organizationId}/staff/${userId}`))
  batch.update(db.doc(`organizations/${organizationId}`), {
    participants: admin.firestore.FieldValue.arrayRemove(userId),
  })

  return batch.commit()
}

const createOrganization = (name, ownerId) => {
  return db
    .collection('organizations')
    .add({
      name,
      ownerId,
      participants: [],
      createdAt: new Date(),
    })
    .then(doc => createStaffMember(doc.id, ownerId, ['admin']))
}

const checkIfUserIsOrganisationAdmin = async (organizationId, uid) => {
  const doc = await db.doc(`organizations/${organizationId}/staff/${uid}`).get()

  const { roles } = doc.data()

  if (!roles.includes('admin'))
    throw new functions.https.HttpsError(
      'permission-denied',
      'User is not admin'
    )
}

// Functions

const createOrganizationOnCall = functions.https.onCall((data, context) => {
  const name = assert(data, 'name')
  const ownerId = assertUID(context)

  return catchErrors(createOrganization(name, ownerId))
})

const deleteStaffMemberOnCall = functions.https.onCall(
  async (data, context) => {
    const userId = assert(data, 'userId')
    const organizationId = assert(data, 'organizationId')
    const adminId = assertUID(context)

    await checkIfUserIsOrganisationAdmin(organizationId, adminId)

    return catchErrors(deleteStaffMember(organizationId, userId))
  }
)

module.exports = {
  createOrganizationOnCall,
  deleteStaffMemberOnCall,
}
