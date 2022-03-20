'use strict'

import isEmpty from 'is-empty'

export default function normalizeEmail (email) {
  if (isEmpty(email)) {
    return ''
  }

  return email.toLowerCase().trim()
}
