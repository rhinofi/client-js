const calculateFact = require('./calculateFact')

const recipient = '0xCc6E2d20cC5AaFDCa329bA2d63e5ba5edD684B2F'
const baseUnitsAmount = '10'
const tokenAddress = '0xe343Ef947f88873F740c5a1CB96b3Fc201993aD4'
const salt = 101
const expectedResult = 'd04c9a75be0510852034a048b086a111b6481b7e544c4510f89b660e534a7a0d'

describe('calculateFact', () => {
  it('works is given valid data', () => {
    expect(calculateFact(recipient, baseUnitsAmount, tokenAddress, salt))
      .toEqual(expectedResult)
  })

  it('gives the same result if addresses are lower case', () => {
    expect(calculateFact(recipient.toLowerCase(), baseUnitsAmount, tokenAddress.toLowerCase(), salt))
      .toEqual(expectedResult)
  })

  it('throws an error if checksum is invalid', () => {
    // changed capitalisation of last char
    expect(() => calculateFact('0xCc6E2d20cC5AaFDCa329bA2d63e5ba5edD684B2f', baseUnitsAmount, tokenAddress, salt))
      .toThrow('0xCc6E2d20cC5AaFDCa329bA2d63e5ba5edD684B2f is not a valid address, or the checksum is invalid')
  })

  it('throws an error if address is invalid', () => {
    // changed last char to X
    expect(() => calculateFact('0xCc6E2d20cC5AaFDCa329bA2d63e5ba5edD684B2X', baseUnitsAmount, tokenAddress, salt))
      .toThrow('0xCc6E2d20cC5AaFDCa329bA2d63e5ba5edD684B2X is not a valid address, or the checksum is invalid')
  })
})
