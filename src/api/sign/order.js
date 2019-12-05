const { MetamaskSubprovider } = require ("@0x/subproviders")
const {signatureUtils, orderHashUtils} = require('@0x/order-utils')

module.exports = async (efx, order) => {
  const orderHash = orderHashUtils.getOrderHashHex(order)

  const provider = efx.isMetaMask
                    ? new MetamaskSubprovider(efx.web3.currentProvider)
                    : efx.web3.currentProvider

  const signature = await signatureUtils.ecSignHashAsync(
    provider,
    orderHash,
    efx.get('account')
  )

  const signedOrder = Object.assign({}, order, { signature })
  
  /**
  const isValid = signatureUtils.isValidSignatureAsync(orderHash, signedOrder, efx.get('account').toLowerCase())

  console.log( "is_valid ->", isValid)
  **/

  return signedOrder
}
