const fs = require('fs');
const path = require('path');
const {get} = require('request-promise');

module.exports = (efx, vaultId, amount, userAddress) => {

  console.log("efx ->", efx.config)

  //get StarkEx contract address from config
  const dexAddress = "0xBd25cD867C304F079E696CBE44D958f3d3B683ba";
  const args = [
    "117817125247250073004144863651748497821726634586140800650875",
    vaultId,
    amount
  ]

  return efx.eth.call(efx.contract.abi.StarkEx, dexAddress, "deposit", args)
}


