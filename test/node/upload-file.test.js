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
    const fileMimeType = 'text/html'
    const stats = fs.statSync('jest.config.js')
    const fileSizeInBytes = stats.size
    const readStream = fs.createReadStream('jest.config.js')

    const promise = uploadFile({
      uploadUrl: `${UPLOAD_URL}/uploads`,
      fileMimeType: fileMimeType,
      contentLength: fileSizeInBytes,
      file: readStream
    })

    promise.then(body => {
      expect(body).toEqual({})
    })
  })
})
