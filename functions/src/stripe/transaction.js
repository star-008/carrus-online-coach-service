const { db, admin } = require('../../firebase')
const { assert, assertUID } = require('../helpers')
const { stripe, functions } = require('../config')

const sendEmailTemplate = require('../mailjet/send-email-template')

const clientOrderTemplateId = functions.config().email_templates.client_order
const coachOrderTemplateId = functions.config().email_templates.coach_order
const coachFreeConsultationTemplate = functions.config().email_templates
  .coach_free_consultation

const getOrder = async (seekerId, coachId, itemId) => {
  return db
    .collection('orders')
    .doc(`${coachId}-${seekerId}-${itemId}`)
    .get()
}

const createOrder = (seekerId, coachId, itemId) => {
  const date = new Date()
  return db
    .collection('orders')
    .doc(`${coachId}-${seekerId}-${itemId}`)
    .set({
      seekerId,
      coachId,
      itemId,
      type: 'package',
      participants: [seekerId, coachId],
      lastTransactionAt: date,
      createdAt: date,
    })
}

const getOrCreateOrder = async (seekerId, coachId, itemId) => {
  // If order exists, return the reference, otherwise create
  const orderDoc = await getOrder(seekerId, coachId, itemId)

  if (!orderDoc.exists) await createOrder(seekerId, coachId, itemId)

  return orderDoc.ref
}

const createTransaction = (orderRef, item, charge, seekerId, coachId) => {
  const date = new Date()

  const orderPromise = orderRef.update({ lastTransactionAt: date })
  const transactionPromise = orderRef.collection('transactions').add({
    item,
    charge,
    seekerId,
    coachId,
    participants: [seekerId, coachId],
    createdAt: date,
  })

  const numSessions = item && item.type === 'fixed' ? item.numSessions : 1
  const updateSessions = updateNumSessions(numSessions, coachId)

  return Promise.all([orderPromise, transactionPromise, updateSessions])
}

const updateNumSessions = (numSessions, uid) => {
  return db
    .collection('users')
    .doc(uid)
    .update({
      numSessions: admin.firestore.FieldValue.increment(numSessions),
    })
}

const freeConsultation = functions.https.onCall(async (data, context) => {
  const seekerId = assertUID(context)
  const coachId = assert(data, 'coachId')
  const itemId = 'free-consultation'

  const order = await getOrder(seekerId, coachId, itemId)

  if (order.exists) {
    throw new functions.https.HttpsError(
      'already-exists',
      'user has already ordered free consultation with this coach'
    )
  }

  await createOrder(seekerId, coachId, itemId)
  await createTransaction(order.ref, null, null, seekerId, coachId)

  const docs = await db.getAll(
    db.doc(`users/${coachId}`),
    db.doc(`users/${seekerId}`)
  )

  const [coach, seeker] = docs.map(doc => {
    return {
      id: doc.id,
      ...doc.data(),
    }
  })

  const coachFullName = coach.firstName + ' ' + coach.lastName
  const seekerFullName = seeker.firstName + ' ' + seeker.lastName

  await sendEmailTemplate(
    coach.email,
    coachFullName,
    coachFreeConsultationTemplate,
    {
      coachFirstName: coach.firstName,
      seekerFullName,
      seekerFirstName: seeker.firstName,
    }
  )

  return 'complete'
})

const transaction = functions.https.onCall(async (data, context) => {
  const paymentMethodId = data.paymentMethodId
  const coachPackageId = data.coachPackageId
  const coachId = data.coachId
  const seekerId = context.auth.uid

  const docs = await db.getAll(
    db.doc(`users/${coachId}/packages/${coachPackageId}`),
    db.doc(`users/${coachId}`)
  )

  const [coachPackage, coach] = docs.map(doc => {
    return {
      id: doc.id,
      ...doc.data(),
    }
  })

  const basePrice = Math.round(coachPackage.price * 100)
  const totalAmount = Math.round((basePrice + 30) / (1 - 0.029)) // 30cents & 2.9%
  const carrusPercentage = coach.vip ? 0.1 : 0.15 // 10% if vip, or 15%
  const carrusFee = Math.round(totalAmount * carrusPercentage)

  const paymentIntentObject = {
    amount: totalAmount,
    currency: 'usd',
    payment_method: paymentMethodId,
    application_fee_amount: carrusFee,
    on_behalf_of: coach.stripeAccount.stripe_user_id,
    transfer_data: {
      destination: coach.stripeAccount.stripe_user_id,
    },
    description: coachPackage.title,
    metadata: {
      packageTitle: coachPackage.title,
      packageDescription: coachPackage.description.substring(0, 400) || '',
      packageId: coachPackage.id,
      coachId: coachId,
      seekerId: seekerId,
      price: '$' + coachPackage.price,
    },
  }

  return stripe.paymentIntents.create(paymentIntentObject)
})

const fulfillTransaction = async intent => {
  const { seekerId, coachId, packageId } = intent.metadata

  const docs = await db.getAll(
    db.doc(`users/${coachId}/packages/${packageId}`),
    db.doc(`users/${coachId}`),
    db.doc(`users/${seekerId}`)
  )

  const [coachPackage, coach, seeker] = docs.map(doc => {
    return {
      id: doc.id,
      ...doc.data(),
    }
  })

  const orderRef = await getOrCreateOrder(seekerId, coachId, packageId)
  await createTransaction(orderRef, coachPackage, intent, seekerId, coachId)

  const coachFullName = coach.firstName + ' ' + coach.lastName
  const seekerFullName = seeker.firstName + ' ' + seeker.lastName

  return Promise.all[
    (sendEmailTemplate(coach.email, coachFullName, coachOrderTemplateId, {
      coachFirstName: coach.firstName,
      seekerFullName,
      seekerFirstName: seeker.firstName,
    }),
    sendEmailTemplate(seeker.email, seekerFullName, clientOrderTemplateId, {
      firstName: seeker.firstName,
    }))
  ]
}

module.exports = {
  transaction,
  freeConsultation,
  fulfillTransaction,
}
