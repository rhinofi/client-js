/**
 *
 * @param {Object} orderIdOrCid 'xxx' or { orderId: 'xxx' } or { cid: 'yyy' }
 */
module.exports = orderIdOrCid => {
  if (typeof orderIdOrCid === 'object' && orderIdOrCid !== null) {
    const { cid, orderId } = orderIdOrCid
    return cid ? { cid } : { orderId }
  } else {
    // Supporting input to be orderId as original behavior
    return { orderId: orderIdOrCid }
  }
}
