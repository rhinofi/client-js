const validateAssertions = require('../validators/validateAssertions copy')
const config = {
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

  const efx ={}
  efx.config = config

  const nonce = Date.now() //- 1500// 1000 + 60 * 60 * 24 + ''
  const signature = ''
  symbol = 'ETH'
  strkKey =''
const assertionError = validateAssertions({efx, symbol, signature})

console.log(assertionError)
  
