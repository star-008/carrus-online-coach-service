const functions = require('firebase-functions')

const Stripe = require('stripe')
const Mailjet = require('node-mailjet')

const STRIPE_SECRET = functions.config().stripe.secret
const stripe = new Stripe(STRIPE_SECRET)

const MJ_API_KEY = functions.config().mailjet.api_key
const MJ_API_SEC = functions.config().mailjet.secret
const mailjet = Mailjet.connect(MJ_API_KEY, MJ_API_SEC)

const env =
  JSON.parse(process.env.FIREBASE_CONFIG).projectId === 'carrus-dev'
    ? 'dev'
    : 'prod'

const Rollbar = require('rollbar')

const rollbar = new Rollbar({
  accessToken: functions.config().rollbar.access_token,
  captureUncaught: true,
  captureUnhandledRejections: true,
  environment: env,
})

module.exports = {
  stripe,
  mailjet,
  env,
  functions,
  rollbar,
}
