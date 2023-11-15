'use strict'

const useLegacyCrypto = parseInt(process.versions && process.versions.node && process.versions.node.split('.')[0]) < 15
if (useLegacyCrypto) {
  // We are on an old version of Node.js that requires legacy crypto utilities.
  console.log('using legacy')
  module.exports = require('./utils-legacy')
} else {
  console.log('using webcrypto')
  module.exports = require('./utils-webcrypto');
}
