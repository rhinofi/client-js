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
        starkTokenId: '0x5fa3383597691ea9d827a79e1a4f0f7989c35ced18ca9619de8ab97e661020',
        starkVaultId: '0xv1'
      },
      USD: {
        decimals: 6,
        tokenAddress: '0xdac17f958d2ee523a2206206994597c13d831ec7',
        minOrderSize: 25,
        settleSpread: -0.026,
        starkTokenId: '0x774961c824a3b0fb3d2965f01471c9c7734bf8dbde659e0c08dca2ef18d56a',
        starkVaultId: '0xv2'
      },
      ZRX: {
        decimals: 16,
        tokenAddress: '0xe41d2489571d322189246dafa5ebde1f4699f498',
        minOrderSize: 40,
        starkTokenId: '0x774961c824a3b0fb3d2965f01471c9c7734bf8dbde659e0c08dca2ef18d56a',
        starkVaultId: '0xv3'
      }
    }
  }

  nock('https://staging-api.deversifi.com/')
    .post('/v1/trading/r/getUserConf', body => {
      return true
    })
    .reply(200, apiResponse)
}
