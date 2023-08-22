'use strict';

/**
* Get a socket stream compatible with the current runtime environment.
*/
module.exports.getStream = function getStream(ssl) {
  const net = require('net');
  if (typeof net.Socket === 'function') {
    console.log('stream')
    return new net.Socket
  }
  console.log('stream pg-cloudflare')
  const { CloudflareSocket } = require('pg-cloudflare')
  return new CloudflareSocket(ssl)
}

/**
 * Get a TLS secured socket, compatible with the current environment,
 * using the socket and other settings given in `options`.
 */
module.exports.secureStream = function secureStream(sendCredentials,connection) {
  console.log('tls')
  const Tls = require('tls');
  if (Tls.connect) {
    connection.startTLS(err => {
      // after connection is secure
      if (err) {
        // SSL negotiation error are fatal
        err.code = 'HANDSHAKE_SSL_ERROR';
        err.fatal = true;
        this.emit('error', err);
      }
      sendCredentials(connection);
    });
    return
  }
  console.log('tls pg-cloudflare')
  try {
    connection.stream.startTls({});
    sendCredentials(connection);
  }catch (err) {
    console.log(`secureStream pg-cloudflare error: ${err}`)
    // SSL negotiation error are fatal
    err.code = 'HANDSHAKE_SSL_ERROR';
    err.fatal = true;
    this.emit('error', err);
    throw err
  }
  console.log('secureStream pg-cloudflare finish')
}
