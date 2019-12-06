const { payApiKey, payApiUrl, payReturnUrl } = require('../config')
const Wreck = require('@hapi/wreck')

class PayService {
  get options () {
    return {
      headers: {
        Authorization: `Bearer ${payApiKey}`,
        'content-type': 'application/json'
      }
    }
  }

  payRequestData (amount, reference, description) {
    return {
      amount,
      reference,
      description,
      'return_url': payReturnUrl
    }
  }

  async payRequest (amount, reference, description) {
    const data = { ...this.options, payload: this.payRequestData(amount, reference, description) }
    try {
      const { payload } = await Wreck.post(`${payApiUrl}/payments`, data)
      return JSON.parse(payload.toString())
    } catch (e) {
      throw e
    }
  }

  async payStatus (url) {
    try {
      const { payload } = await Wreck.get(url, this.options)
      return JSON.parse(payload.toString())
    } catch (e) {
      throw e
    }
  }
}

module.exports = {
  PayService
}
