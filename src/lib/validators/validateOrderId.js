const errorReasons = require('../error/reasons')

module.exports = (orderId)=>{
    if(!orderId)    {
        return {
            error: "ERR_INVALID_ORDER_ID",
            reason: errorReasons.ERR_INVALID_ORDER_ID || "ERR_INVALID_ORDER_ID"
        }
    }
}