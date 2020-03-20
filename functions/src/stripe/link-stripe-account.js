const { db } = require('../../firebase')
const { functions } = require('../config')

const axios = require('axios')

const STRIPE_SECRET = functions.config().stripe.secret

module.exports = functions.https.onCall(async (data, context) => {
  const uid = context.auth.uid
  const code = data.code
  let url = 'https://connect.stripe.com/oauth/token'

  const response = await axios.post(url, {
    client_secret: STRIPE_SECRET,
    code: code,
    grant_type: 'authorization_code',
  })

  const stripeAccount = response.data

  return db
    .collection('users')
    .doc(uid)
    .update({
      stripeAccount,
    })
})
