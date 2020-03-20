const { mailjet } = require('../config')

module.exports = async function sendEmailTemplate(
  toEmail,
  toName,
  tplID,
  tplData
) {
  let toN = toName || toEmail
  tplID = Number(tplID) // Cast the tplID
  var requestObject = {
    Messages: [
      {
        To: [
          {
            Email: toEmail,
            Name: toN,
          },
        ],
        TemplateID: tplID,
        TemplateLanguage: true,
      },
    ],
  }

  // Add Variable
  if (tplData && Object.keys(tplData).length) {
    requestObject.Messages[0].Variables = tplData
  }

  const request = mailjet
    .post('send', { version: 'v3.1' })
    .request(requestObject)

  return request
}
