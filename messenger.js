'use strict'

/** ******* Imports ********/

const {
  /* The following functions are all of the cryptographic
  primatives that you should need for this assignment.
  See lib.js for details on usage. */
  byteArrayToString,
  genRandomSalt,
  generateEG, // async
  computeDH, // async
  verifyWithECDSA, // async
  HMACtoAESKey, // async
  HMACtoHMACKey, // async
  HKDF, // async
  encryptWithGCM, // async
  decryptWithGCM,
  cryptoKeyToJSON, // async
  govEncryptionDataStr
} = require('./lib')

/** ******* Implementation ********/

class MessengerClient {
  constructor (certAuthorityPublicKey, govPublicKey) {
    // the certificate authority DSA public key is used to
    // verify the authenticity and integrity of certificates
    // of other users (see handout and receiveCertificate)

    // you can store data as needed in these objects.
    // Feel free to modify their structure as you see fit.
    this.caPublicKey = certAuthorityPublicKey
    this.govPublicKey = govPublicKey
    this.conns = {} // data for each active connection
    this.certs = {} // certificates of other users
    this.EGKeyPair = {} // keypair from generateCertificate
  }

  /**
   * Generate a certificate to be stored with the certificate authority.
   * The certificate must contain the field "username".
   *
   * Arguments:
   *   username: string
   *
   * Return Type: certificate object/dictionary
   */
  async generateCertificate (username) {
    // Construct EG pair and save
    const egKeys = await generateEG()
    const pubKey = await cryptoKeyToJSON(egKeys.pub)
    const secKey = await cryptoKeyToJSON(egKeys.sec)
    this.EGKeyPair = {pubKey, secKey}

    // Construct certificate
    const certificate = {
      username,
      pubKey
    }

    // Upload the self certificate certs object
    this.certs[certificate.username] = JSON.stringify(certificate)

    return certificate
  }

  /**
 * Receive and store another user's certificate.
 *
 * Arguments:
 *   certificate: certificate object/dictionary
 *   signature: string
 *
 * Return Type: void
 */
  async receiveCertificate (certificate, signature) {
    // The signature will be on the output of stringifying the certificate
    // rather than on the certificate directly.
    const certString = JSON.stringify(certificate)

    // Verify certificate
    const verificationRes = await verifyWithECDSA(this.caPublicKey, certString, signature)
    if (!verificationRes) throw ('Tampering detected with certificate!')

    // Add stringified ceritifcate to cert object
    this.certs[certificate.username] = certString

    throw ('not implemented!')
  }

  /**
 * Generate the message to be sent to another user.
 *
 * Arguments:
 *   name: string
 *   plaintext: string
 *
 * Return Type: Tuple of [dictionary, string]
 */
  async sendMessage (name, plaintext) {
    const cert = JSON.parse(this.certs[name])
    const recipientPubKey = cert.pubKey

    // Set up session
    if (!this.conns[name]) {

    }

    const sendingKey = ''
    const iv = genRandomSalt()

    // Construct header
    const header = {
      sendingKey: '',
      iv,
      vGov: '',
      cGov: '',
      ivGov: ''
    }

    encryptWithGCM(sendingKey, plaintext, iv, header)

    const ciphertext = ''
    return [header, ciphertext]
  }

  /**
 * Decrypt a message received from another user.
 *
 * Arguments:
 *   name: string
 *   [header, ciphertext]: Tuple of [dictionary, string]
 *
 * Return Type: string
 */
  async receiveMessage (name, [header, ciphertext]) {
    throw ('not implemented!')
    return plaintext
  }
};

module.exports = {
  MessengerClient
}
