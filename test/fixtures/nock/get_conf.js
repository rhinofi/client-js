const nock = require('nock')

module.exports = () => {
  /* const apiResponse = {
    stark: {
      StarkEXAddress: '0xBd25cD867C304F079E696CBE44D958f3d3B683ba'
    },
    '0x': {
      protocol: '0x',
      minOrderTime: 300,
      tokenRegistry: {
        ETH: {
          decimals: 18,
          wrapperAddress: '0xaa7427d8f17d87a28f5e1ba3adbb270badbe1011',
          minOrderSize: 0.1,
          tokenId: '0x1',
          vaultId: '0xa1'
        },
        USD: {
          decimals: 6,
          wrapperAddress: '0x1a9b2d827f26b7d7c18fec4c1b27c1e8deeba26e',
          tokenAddress: '0xdac17f958d2ee523a2206206994597c13d831ec7',
          minOrderSize: 25,
          settleSpread: -0.026,
          tokenId: '0x2',
          vaultId: '0xa2'
        },
        ZRX: {
          decimals: 18,
          wrapperAddress: '0xcf67d7a481ceeca0a77f658991a00366fed558f7',
          tokenAddress: '0xe41d2489571d322189246dafa5ebde1f4699f498',
          minOrderSize: 40,
          tokenId: '0x3',
          vaultId: '0xv1'
        }
      },
      StarkEXAddress: '0xBd25cD867C304F079E696CBE44D958f3d3B683ba',
      ethfinexAddress: '0x61b9898c9b60a159fc91ae8026563cd226b7a0c1', // gets fee paid in
      exchangeAddress: '0xdcdb42c9a256690bd153a7b409751adfc8dd5851', // actual exchange contract address
      exchangeSymbols: ['tETHUSD', 'tZRXUSD', 'tZRXETH']
    }
  } */
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
        starkVaultId: '0xb2'
      },
      ZRX: {
        decimals: 18,
        tokenAddress: '0xe41d2489571d322189246dafa5ebde1f4699f498',
        minOrderSize: 40,
        starkTokenId: '0x3',
        starkVaultId: '0xc3'
      }
    }
  }

  nock('https://staging-api.deversifi.com/')
    .post('/v1/trading/r/getConf', {})
    .reply(200, apiResponse)
}
