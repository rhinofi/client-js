
module.exports = (tokenAddress, chainId) => ({
  data: Buffer.from(
    `00${tokenAddress}000000000000000${chainId}`,
    'hex'
  )
})
