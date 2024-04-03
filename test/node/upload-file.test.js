/* eslint-env jest */
'use strict'

const fs = require('fs')
const nock = require('nock')
const uploadFile = require('../../src/node/upload-file')

const UPLOAD_URL = 'https://upload-url.example.com'

const mockFetch = () => {
  nock(UPLOAD_URL)
    .put('/uploads')
    .reply(204, null)
}

describe('#uploadFile', () => {
  beforeEach(() => {
    mockFetch()
  })

  it('returns empty body', () => {
    const fileName = 'jest.config.js'
    const fileMimeType = 'text/html'
    const file = {
      name: fileName,
      body: fs.createReadStream(fileName)
    }

    const promise = uploadFile({
      uploadUrl: `${UPLOAD_URL}/uploads`,
      fileMimeType: fileMimeType,
      file: file
    })

    promise.then(body => {
      expect(body).toEqual(null)
    })
  })
})
