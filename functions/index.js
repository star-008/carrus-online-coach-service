const {
  createOrganizationOnCall,
  deleteStaffMemberOnCall,
} = require('./src/organization/organization')
const { stripeWebhooksEndpoint } = require('./src/stripe/webhooks')

module.exports = {
  // Algolia
  write_coach_to_algolia: require('./src/algolia/write-coach-to-algolia'),

  // Chat
  send_chat_notification: require('./src/chat/send-chat-notification'),
  send_chat_email: require('./src/chat/send-chat-email'),
  update_chat: require('./src/chat/update-chat'),

  //Mailjet
  add_mailjet_contact: require('./src/mailjet/add-mailjet-contact'),

  // Stripe
  link_stripe_account: require('./src/stripe/link-stripe-account'),
  transaction: require('./src/stripe/transaction').transaction,
  freeConsultation: require('./src/stripe/transaction').freeConsultation,
  stripeWebhooksEndpoint,

  // User
  add_standard_package: require('./src/user/add-standard-package'),
  aggregate_review_data: require('./src/user/aggregate-review-data'),
  generate_profile_image_thumbnails: require('./src/user/generate-profile-image-thumbnails'),
  nearly_there_email: require('./src/user/nearly-there-email'),
  profileOnWrite: require('./src/user/profile').profileOnWrite,
  syncUserProfile: require('./src/user/profile').syncUserProfile,
  send_welcome_emails: require('./src/user/send-welcome-emails'),
  updateNumPackages: require('./src/user/packages').updateNumPackages,

  //maintenance
  maintenance: require('./src/maintenance'),

  // organization
  createOrganizationOnCall,
  deleteStaffMemberOnCall,
}
