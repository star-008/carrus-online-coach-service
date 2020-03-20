const functions = require('firebase-functions')
const _ = require('lodash')

/**
Validates data payload of a callable function
*/
exports.assert = (data, key) => {
  if (!data[key])
    throw new functions.https.HttpsError(
      'invalid-argument',
      `function called without ${key} data`
    )

  return data[key]
}

/**
Validates auth context for callable function 
*/
exports.assertUID = context => {
  if (!context.auth)
    throw new functions.https.HttpsError(
      'permission-denied',
      'function called without context.auth'
    )

  return context.auth.uid
}

/**
Sends a descriptive error response when running a callable function
*/
exports.catchErrors = async promise => {
  try {
    return await promise
  } catch (err) {
    throw new functions.https.HttpsError('unknown', err)
  }
}

/**
 * Evaluates to true if value is empty
 */
const isEmptyString = s => _.isString(s) && !s.replace(/ /g, '')
const isEmptyObject = o => _.isObject(o) && _.isEmpty(o)
exports.anyIsEmpty = val =>
  _.isNil(val) || isEmptyString(val) || isEmptyObject(val)
