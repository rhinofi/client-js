const nock = require('nock')

module.exports = () => {
  const apiResponse = {
    DVF: {
      exchangeSymbols: ['tETHUSD', 'tZRXUSD', 'tZRXETH'],
      exchangeAddress: '0xBd25cD867C304F079E696CBE44D958f3d3B683ba'
    },
    tokenRegistry: {
      ETH: {
        decimals: 18,
        minOrderSize: 0.1,
        starkTokenId: '0x1',
        starkVaultId: '0xa1'
      },
      USD: {
        decimals: 6,
        tokenAddress: '0xdac17f958d2ee523a2206206994597c13d831ec7',
        minOrderSize: 25,
        settleSpread: -0.026,
        starkTokenId: '0x2',
        starkVaultId: '0xa2'
      },
      ZRX: {
        decimals: 16,
        tokenAddress: '0xe41d2489571d322189246dafa5ebde1f4699f498',
        minOrderSize: 40,
        starkTokenId: '0x3',
        starkVaultId: '0xv1'
      }
    }
  }

  nock('https://staging-api.deversifi.com/')
    .post('/v1/getUserConf', body => {
      return true
    })
    .reply(200, apiResponse)
}
