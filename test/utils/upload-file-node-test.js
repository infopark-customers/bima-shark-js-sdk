/* eslint-env mocha */
'use strict'

const { expect } = require('chai')
const nock = require('nock')
const uploadFile = require('../../src/utils/upload-file-node')

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
    const file = new window.File([''], 'filename', { type: fileMimeType })
    const promise = uploadFile({
      uploadUrl: `${UPLOAD_URL}/uploads`,
      fileMimeType: fileMimeType,
      file: file
    })

    promise.then(body => {
      expect(body).to.eql({})
    })
  })
})
