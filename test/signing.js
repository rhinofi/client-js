/* eslint-env mocha */

const { assert } = require('chai')

const instance = require('./helpers/instance')
const ecRecover = require('./helpers/ecRecover')
const mockGetConf = require('./fixtures/nock/get_conf')

let efx

before(async () => {
  mockGetConf()

  efx = await instance()
})

it('efx.sign(toSign) // sign arbitrary objects', async () => {
  // when signing hex values we should remove the 0x
  const message = '0xa4d9a634348b09f23a5bbd3568f8b12b91ff499c'

  const signature = await efx.sign(message.slice(2))

  const recovered = ecRecover(message.slice(2), signature)

  assert.equal(efx.get('account').toLowerCase(), recovered.toLowerCase())
})

it('create and sign a buy order', async () => {
  const symbol = 'ETHUSD'
  const amount = 0.8
  const price = 274

  const order = efx.contract.createOrder(symbol, amount, price)

  const signed = await efx.sign.order(order)

  //assert.notEqual(signed, order)

  const sellAmount = amount * price
  const makerAmount = efx.web3.utils.toBN(
    Math.trunc(10 ** efx.config['0x'].tokenRegistry.USD.decimals * sellAmount)
  ).toString(10)

  // assert.equal(signed.makerTokenAddress, efx.config['0x'].tokenRegistry.USD.wrapperAddress)
  // assert.equal(signed.makerTokenAmount, makerAmount)

  // const buyAmount = amount
  // const takerAmount = efx.web3.utils.toBN(
  //   Math.trunc(10 ** efx.config['0x'].tokenRegistry.ETH.decimals * buyAmount)
  // ).toString(10)

  // assert.equal(signed.takerTokenAddress, efx.config['0x'].tokenRegistry.ETH.wrapperAddress)
  // assert.equal(signed.takerTokenAmount, takerAmount)
})

it('create and sign a sell order', async () => {
  const symbol = 'ETHUSD'
  const amount = -1.5
  const price = 300

  const order = efx.contract.createOrder(symbol, amount, price)

  const signed = await efx.sign.order(order)

  // TODO: update tests to correct values

  // const sellAmount = Math.abs(amount)
  // const makerAmount = efx.web3.utils.toBN(
  //   Math.trunc(10 ** efx.config['0x'].tokenRegistry.ETH.decimals * sellAmount)
  // ).toString(10)

  // assert.equal(signed.makerTokenAddress, efx.config['0x'].tokenRegistry.ETH.wrapperAddress)
  // assert.equal(signed.makerTokenAmount, makerAmount)

  // const buyAmount = Math.abs(amount * price)
  // const takerAmount = efx.web3.utils.toBN(
  //   Math.trunc(10 **efx.config['0x'].tokenRegistry.USD.decimals * buyAmount)
  // ).toString(10)

  // assert.equal(signed.takerTokenAddress, efx.config['0x'].tokenRegistry.USD.wrapperAddress)
  // assert.equal(signed.takerTokenAmount, takerAmount)
})
