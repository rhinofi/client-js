// Used in various on-chain + HTTP POST functions
// ss we need the txHash ASAP (before the tx is mined),
// we need to use the 'transactionHash' of the underlyind 'send' method
// PromEvents make it difficult to listen to events when the PromEvent
// is nested in other Promises. This workaround allows to listen to the
// event without changing the return signatures of the underlying 'send'
// More : https://github.com/ChainSafe/web3.js/issues/1547
module.exports = extraCallback => {
  let transactionHashCb
  const transactionHashPromise = new Promise((resolve, reject) => {
    transactionHashCb = (err, result) => {
      if (err) {
        reject(err)
      } else {
        resolve(result)
        extraCallback && extraCallback(result)
      }
    }
  })
  return [transactionHashPromise, transactionHashCb]
}
