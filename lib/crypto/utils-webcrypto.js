// 'use strict'
//
// const nodeCrypto = require('crypto')
//
// /**
//  * The Web Crypto API - grabbed from the Node.js library or the global
//  * @type Crypto
//  */
// // eslint-disable-next-line no-undef
// const webCrypto = nodeCrypto.webcrypto || globalThis.crypto
// /**
//  * The SubtleCrypto API for low level crypto operations.
//  * @type SubtleCrypto
//  */
// const subtleCrypto = webCrypto.subtle
// const textEncoder = new TextEncoder()
//
// /**
//  *
//  * @param {*} length
//  * @returns
//  */
// function randomBytes(length) {
//   return webCrypto.getRandomValues(Buffer.alloc(length))
// }
//
// async function md5(string) {
//   try {
//     return nodeCrypto.createHash('md5').update(string, 'utf-8').digest('hex')
//   } catch (e) {
//     // `createHash()` failed so we are probably not in Node.js, use the WebCrypto API instead.
//     // Note that the MD5 algorithm on WebCrypto is not available in Node.js.
//     // This is why we cannot just use WebCrypto in all environments.
//     const data = typeof string === 'string' ? textEncoder.encode(string) : string
//     const hash = await subtleCrypto.digest('MD5', data)
//     return Array.from(new Uint8Array(hash))
//       .map(b => b.toString(16).padStart(2, '0'))
//       .join('')
//   }
// }
//
// // See AuthenticationMD5Password at https://www.postgresql.org/docs/current/static/protocol-flow.html
// async function postgresMd5PasswordHash(user, password, salt) {
//   const inner = await md5(password + user);
//   const outer = await md5(Buffer.concat([Buffer.from(inner), salt]));
//   return `md5${outer}`
// }
//
// /**
//  * Create a SHA-256 digest of the given data
//  * @param {Buffer} data
//  */
// async function sha256(text) {
//   return new Promise((resolve, reject) => {
//     subtleCrypto.digest('SHA-256', text)
//       .then(result => {
//         resolve(result);
//       })
//       .catch(error => {
//         reject(error);
//       });
//   });
//   // return await subtleCrypto.digest('SHA-256', text)
// }
//
// function xorRotating(a, seed) {
//   const result = Buffer.allocUnsafe(a.length);
//   const seedLen = seed.length;
//
//   for (let i = 0; i < a.length; i++) {
//     result[i] = a[i] ^ seed[i % seedLen];
//   }
//   return result;
// }
//
// async function encrypt(password, scramble, key) {
//   // const stage1 = xorRotating(
//   //   Buffer.from(`${password}\0`, 'utf8'),
//   //   scramble
//   // );
//   //
//   // const publicKey = await subtleCrypto.importKey(
//   //   'spki',
//   //   key,
//   //   {
//   //     name: 'RSA-OAEP',
//   //     hash: 'SHA-256'
//   //   },
//   //   false,
//   //   ['encrypt']
//   // );
//   //
//   // const encryptedBuffer = await subtleCrypto.encrypt(
//   //   {
//   //     name: 'RSA-OAEP'
//   //   },
//   //   publicKey,
//   //   stage1
//   // );
//   // return new Uint8Array(encryptedBuffer);
//   const stage1 = xorRotating(
//     Buffer.from(`${password}\0`, 'utf8'),
//     scramble
//   );
//   return nodeCrypto.publicEncrypt(key, stage1);
// }
//
// // function concatenateBuffers(buffer1, buffer2) {
// //   const combined = new Uint8Array(buffer1.length + buffer2.length);
// //   console.log(buffer1.length)
// //   console.log(buffer2.length)
// //   combined.set(new Uint8Array(buffer1), 0);
// //   combined.set(new Uint8Array(buffer2), buffer1.length);
// //   return combined.buffer;
// // }
//
//
// async function sha1(msg,msg1,msg2) {
//   // const encoder = new TextEncoder();
//   // let concatenatedData = encoder.encode(msg);
//   // if (msg1) {
//   //   const data1 = encoder.encode(msg1);
//   //   concatenatedData = concatenateBuffers(concatenatedData, data1);
//   // }
//   //
//   // if (msg2) {
//   //   const data2 = encoder.encode(msg2);
//   //   concatenatedData = concatenateBuffers(encoder.encode(concatenatedData), data2);
//   // }
//   // // console.log(`concatenatedData${concatenatedData.length}`)
//   //
//   // return await subtleCrypto.digest('SHA-1', concatenatedData);
//   const hash = nodeCrypto.createHash('sha1');
//   hash.update(msg);
//   if (msg1) {
//     hash.update(msg1);
//   }
//   if (msg2) {
//     hash.update(msg2);
//   }
//   return hash.digest();
// }
//
// /**
//  * Sign the message with the given key
//  * @param {ArrayBuffer} keyBuffer
//  * @param {string} msg
//  */
// async function hmacSha256(keyBuffer, msg) {
//   const key = await subtleCrypto.importKey('raw', keyBuffer, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'])
//   return await subtleCrypto.sign('HMAC', key, textEncoder.encode(msg))
// }
//
// /**
//  * Derive a key from the password and salt
//  * @param {string} password
//  * @param {Uint8Array} salt
//  * @param {number} iterations
//  */
// async function deriveKey(password, salt, iterations) {
//   const key = await subtleCrypto.importKey('raw', textEncoder.encode(password), 'PBKDF2', false, ['deriveBits'])
//   const params = { name: 'PBKDF2', hash: 'SHA-256', salt: salt, iterations: iterations }
//   return await subtleCrypto.deriveBits(params, key, 32 * 8, ['deriveBits'])
// }
//
// module.exports = {
//   postgresMd5PasswordHash,
//   randomBytes,
//   deriveKey,
//   sha256,
//   hmacSha256,
//   md5,
//   sha1,
//   encrypt,
// }
//

'use strict'

const nodeCrypto = require('node:crypto')

function md5(string) {
  return nodeCrypto.createHash('md5').update(string, 'utf-8').digest('hex')
}

// See AuthenticationMD5Password at https://www.postgresql.org/docs/current/static/protocol-flow.html
function postgresMd5PasswordHash(user, password, salt) {
  const inner = md5(password + user);
  const outer = md5(Buffer.concat([Buffer.from(inner), salt]));
  return `md5${outer}`
}

function sha256(text) {
  return nodeCrypto.createHash('sha256').update(text).digest()
}

function sha1(msg,msg1,msg2) {
  const hash = nodeCrypto.createHash('sha1');
  hash.update(msg);
  if (msg1) {
    hash.update(msg1);
  }
  if (msg2) {
    hash.update(msg2);
  }
  return hash.digest();
}

function xorRotating(a, seed) {
  const result = Buffer.allocUnsafe(a.length);
  const seedLen = seed.length;

  for (let i = 0; i < a.length; i++) {
    result[i] = a[i] ^ seed[i % seedLen];
  }
  return result;
}

function encrypt(password, scramble, key) {
  const stage1 = xorRotating(
    Buffer.from(`${password}\0`, 'utf8'),
    scramble
  );
  return nodeCrypto.publicEncrypt(key, stage1);
}

function hmacSha256(key, msg) {
  return nodeCrypto.createHmac('sha256', key).update(msg).digest()
}

function deriveKey(password, salt, iterations) {
  return nodeCrypto.pbkdf2Sync(password, salt, iterations, 32, 'sha256')
}

module.exports = {
  postgresMd5PasswordHash,
  randomBytes: nodeCrypto.randomBytes,
  deriveKey,
  sha256,
  hmacSha256,
  md5,
  sha1,
  encrypt,
}

