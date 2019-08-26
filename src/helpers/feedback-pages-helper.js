'use strict'

const qs = require('qs')
const { isObject } = require('../utils/typecheck')

class FeedbackPagesHelper {
  /**
   * Creates an URL to a feedback page.
   *
   * @param {string} baseUrl - Feedback Pages base URL.
   * @param {array} path - URL path to feedback page as array.
   * @param {object} [translations={}] - Custom translation interpolation.
   *
   * @return {string} URL to a feedback page.
   *
   * @example
   *  FeedbackPagesHelper.buildUrl('https://feedback.example.org', ['registration', 'failure'])
   *
   * @example
   *  FeedbackPagesHelper.buildUrl('https://feedback.example.org', ['registration', 'success'], { full_name: 'John Doe' })
   *
   * @example
   *  FeedbackPagesHelper.buildUrl('https://feedback.example.org', ['item', 'creation', 'success'], { item_type: { de: 'Gruppe', en: 'Group' } })
   */
  static buildUrl (baseUrl, path, translations = {}) {
    let url = `${baseUrl}/${path.join('/')}`

    if (Object.keys(translations).length > 0) {
      const query = { translations: translations }
      const queryString = qs.stringify(query, { addQueryPrefix: true })
      url += queryString
    }

    return url
  }

  /**
   * Creates an object from an URL query string containing translations.
   *
   * @param {string} queryString - Query string from an URL.
   * @param {string} language - Language code.
   *
   * @return {object} Parsed query string as object for given language code.
   *
   * @example
   *  FeedbackPagesHelper.parseTranslations('?translations[item_type][de]=Gruppe&translations[item_type][en]=Group', 'de')
   *
   * @example
   *  FeedbackPagesHelper.parseTranslations('?translations%5Bitem_type%5D%5Bde%5D=Gruppe&translations%5Bitem_type%5D%5Ben%5D=Group', 'de')
   *
   * @example
   *  FeedbackPagesHelper.parseTranslations('translations%5Bitem_type%5D%5Bde%5D=Gruppe&translations%5Bitem_type%5D%5Ben%5D=Group', 'de')
   */
  static parseTranslations (queryString, language) {
    const query = qs.parse(queryString, { ignoreQueryPrefix: true })
    const translations = query.translations
    const results = {}

    Object.keys(translations).forEach(translationKey => {
      const translation = translations[translationKey]

      if (isObject(translation)) {
        results[translationKey] = translation[language]
      } else {
        results[translationKey] = translation
      }
    })

    return results
  }
}

module.exports = FeedbackPagesHelper
