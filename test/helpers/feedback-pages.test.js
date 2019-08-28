/* eslint-env jest */
'use strict'

const FeedbackPages = require('../../src/helpers/feedback-pages')

describe('FeedbackPagesHelper', () => {
  const baseUrl = 'https://www.example.org/feedback'
  const path = ['foo', 'bar']

  describe('.buildUrl', () => {
    describe('without custom translations', () => {
      const subject = FeedbackPages.buildUrl(baseUrl, path)

      it('creates URL to feedback pages with path', () => {
        expect(subject).toEqual(`${baseUrl}/${path.join('/')}`)
        expect(subject).not.toMatch('?translations')
      })
    })

    describe('with custom translations', () => {
      const translations = {
        full_name: 'John Doe',
        item_type: {
          de: 'Gruppe',
          en: 'Group'
        }
      }

      const subject = FeedbackPages.buildUrl(baseUrl, path, translations)

      it('creates URL to feedback pages with path and custom translations', () => {
        expect(subject).toEqual(`${baseUrl}/${path.join('/')}?translations%5Bfull_name%5D=John%20Doe&translations%5Bitem_type%5D%5Bde%5D=Gruppe&translations%5Bitem_type%5D%5Ben%5D=Group`)
      })
    })
  })

  describe('.parseTranslations', () => {
    const queryString = '?translations%5Bfull_name%5D=John%20Doe&translations%5Bitem_type%5D%5Bde%5D=Gruppe&translations%5Bitem_type%5D%5Ben%5D=Group`'
    const subject = FeedbackPages.parseTranslations(queryString, 'de')

    it('return object with translations', () => {
      expect(subject).toEqual({
        full_name: 'John Doe',
        item_type: 'Gruppe'
      })
    })
  })
})
