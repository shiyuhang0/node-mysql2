'use strict'
// This file contains crypto utility functions for versions of Node.js < 15.0.0,
// which does not support the WebCrypto.subtle API.

const nodeCrypto = require('crypto')

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

async function sha1(msg,msg1,msg2) {
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
