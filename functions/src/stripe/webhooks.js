const { stripe, functions, rollbar } = require('../config')
const { fulfillTransaction } = require('./transaction')

const webhookHandler = data => {
  return fulfillTransaction(data)
}

const webhooksSecret = functions.config().stripe.webhooks_secret

const stripeWebhooksEndpoint = functions.https.onRequest(async (req, res) => {
  try {
    const sig = req.headers['stripe-signature']
    const event = stripe.webhooks.constructEvent(
      req.rawBody,
      sig,
      webhooksSecret
    )
    const data = event.data.object

    await webhookHandler(data)

    res.sendStatus(200)
  } catch (err) {
    rollbar.error(err)
    res.status(500).send(err)
  }
})

module.exports = {
  stripeWebhooksEndpoint,
}
