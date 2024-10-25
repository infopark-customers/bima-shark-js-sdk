function jwtAuthorization ({ accessId, secretKey }) {
  const jwt = require('jsonwebtoken')
  const signature = jwt.sign({}, secretKey, { algorithm: 'HS256', expiresIn: '1m', issuer: accessId })

  return `JWT ${accessId}:${signature}`
}

module.exports = jwtAuthorization
