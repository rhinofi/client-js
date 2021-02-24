const url = require('url')

module.exports = apiResponse => jest.fn((uri, body) => {
  const parsed = new url.URL(uri, 'http://example.com')
  expect(typeof parseInt(parsed.searchParams.get('nonce'))).toBe('number')
  expect(parsed.searchParams.get('signature')).toMatch(/[\da-f]/i)
  return [200, apiResponse]
})
