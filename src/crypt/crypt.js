const crypto = require('crypto');
require('dotenv').config()

// const algorithm = 'aes-256-cbc';
const ENCRYPTION_KEY = process.env.CIBER_PRM_SECRET_USER_PASSWORD;
const secret = process.env.CIBER_PRM_SECRET_IV_LENGTH
// const IV_LENGTH = 16;
// var secret = crypto.randomBytes(16);
function encrypt(text){
  var cipher = crypto.createCipheriv('aes-256-cbc',
    Buffer(ENCRYPTION_KEY), Buffer(secret))
  var crypted = cipher.update(text, 'utf8', 'base64')
  crypted += cipher.final('base64')
  return crypted
}
function decrypt(text){
  var decipher = crypto.createDecipheriv('aes-256-cbc',
    Buffer(ENCRYPTION_KEY), Buffer(secret))
  var dec = decipher.update(text, 'base64', 'utf8')
  dec += decipher.final('utf8')
  return dec
}
module.exports = {
    encrypt: encrypt,
    decrypt:decrypt
  };