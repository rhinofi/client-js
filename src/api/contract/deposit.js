const fs = require('fs');
const path = require('path');
const {get} = require('request-promise');

module.exports = (efx, vaultId, amount, userAddress) => {
  //get StarkEx contract address from config
  const dexAddress = "0x";
  const starkInstance = await efx.eth.call(efx.contract.abi.StarkEx, JSON.parse(dexAddress));

  try {
    return starkInstance.methods.deposit(
      "117817125247250073004144863651748497821726634586140800650875",
      vaultId,
      amount
    )
    .send({ from: userAddress, gasAmount: 200000, gasPrice: 14000000000});
  } catch(e) {
    // Error handling, user corrections
    throw new Error ('deposit fail details : ', e);
  }
}


