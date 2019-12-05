module.exports = {

  ERR_MAKERTOKEN_ADDRESS_INVALID: `
    The 'maker' token address provided in the signed-order did not
    match the pair specified by the API call.
  `,
  ERR_TAKERTOKEN_ADDRESS_INVALID: `
    The 'taker' token address provided in the signed-order did not
    match the pair specified by the API call.
  `,
  ERR_MAKERTOKEN_AMOUNT_INVALID: `
    The signed-order maker amount did not match with the
    amount and price specified in the API call.
  `,
  ERR_TAKERTOKEN_AMOUNT_INVALID: `
    The signed-order taker amount did not match with the
    amount and price specified in the API call.
  `,
  ERR_CORE_ETHFX_0X_ONLY_EXCHANGE_LIMIT_ORDERS: `
    Only exchange limit orders are currently accepted.
  `,
  ERR_CORE_ETHFX_0X_INVALID_CCY: `
    The token specified is currently not tradable via the trustless api.
  `,
  ERR_CORE_ETHFX_0X_SIGNATURE_INVALID: `
    The signature provided with the order was invalid.
  `,
  ERR_CORE_ETHFX_0X_FEE_RECIPIENT_INVALID: `
    The fee recipient address was not specified as Ethfinex.
  `,
  ERR_CORE_ETHFX_0X_TAKER_INVALID: `
    The taker address for the trade was not specified as Ethfinex.
  `,
  ERR_CORE_ETHFX_0X_EXCHANGE_INVALID: `
    The exchange contract address for the trade was not specified correctly.
  `,
  ERR_CORE_ETHFX_0X_EXPIRED: `
    The order expiration date was too soon, or has already passed.
  `,
  ERR_CORE_ETHFX_0X_BELOW_MIN_SIZE: `
    The order size was below the minimum allowed.
  `,
  ERR_CORE_ETHFX_0X_LOCK_TIME_INSUFFICIENT: `
    The tokens required for the trade are not locked for long enough.
  `,
  ERR_CORE_ETHFX_0X_LOCK_INVALID: `
    The tokens required must be locked until after the order expiration time.
  `,
  ERR_CORE_ETHFX_NEEDS_APPROVAL: `
    The tokens required must be locked until after the order expiration time.
  `,
  ERR_CORE_ETHFX_0X_BALANCE_EMPTY: `
    You do not have any balance of the locked tokens required.
  `,
  ERR_CORE_ETHFX_0X_UNLOCK_TOO_LONG: `
    The time of validity for the unlock request is too long.
  `,
  ERR_TRADING_ETHFX_TRUSTLESS_API_RELEASE_TOKENS_ORDERS_ACTIVE: `
    You must cancel active orders which involve selected tokens before unlocking.
  `,
  ERR_TRADING_ETHFX_TRUSTLESS_TOKEN_VERIFY: `
    The provided authentication signature was not valid.
  `,
  ERR_TRADING_ETHFX_TRUSTLESS_ORDER_INVALID: `
    The order requested for cancelation does not exist or is not active.
  `,
  ERR_TRADING_ETHFX_TRUSTLESS_OWNER_INVALID: `
    The signature for cancellation request does not match the order owner.
  `,
  ERR_TRADING_ETHFX_TRUSTLESS_ORDER_CANCEL_FAILURE_0: `
    Cancellation failed. Please try again.
  `,
  ERR_TRADING_ETHFX_TRUSTLESS_ORDER_CANCEL_FAILURE_1: `
    Cancellation failed. Please try again.
  `,
  ERR_TRADING_ETHFX_TRUSTLESS_ORDER_CANCEL_FAILURE_2: `
    Cancellation failed. Please try again.
  `,
  ERR_TRADING_ETHFX_TRUSTLESS_API_ORDER_SUBMIT_CONCURRENCY: `
    You cannot submit new orders concurrently. Please wait and submit again.
  `,
  ERR_TRADING_ETHFX_TRUSTLESS_TOKEN_INVALID: `
    The submitted nonce must be a timestamp in the future.
  `,
  ERR_TRADING_ETHFX_TRUSTLESS_ORDER_SUBMIT_FAILURE_0: `
    Failed to submit order to order book.
  `,
  ERR_TRADING_ETHFX_TRUSTLESS_ORDER_SUBMIT_FAILURE_1: `
    Failed to submit order to order book.
  `,
  ERR_TRADING_ETHFX_TRUSTLESS_API_RELEASE_TOKENS_GEN: `
    Failed to contact ethereum node, please try request again.
  `,
  ERR_TRADING_ETHFX_TRUSTLESS_API_RELEASE_TOKENS_RELEASE: `
    Failed to sign release permission, please try request again.
  `,
  ERR_TRADING_ETHFX_HOT_SIZE_INVALID: `
    Unable to place order of this size at the moment. Please place smaller order or wait and re-submit your order later.
  `,
  ERR_TRADING_ETHFX_HOT_BALANCE_INSUFFICIENT: `
    Too many settlements currently pending on-chain, please wait and re-submit your order.
  `,
  ERR_TRADING_ETHFX_TRUSTLESS_PROTO_INVALID: `
    Trustless protocol type not specified, or invalid, in order submission.
  `,
  ERR_TRADING_ETHFX_TRUSTLESS_BALANCE_INVALID: `
    Insufficient unused balance to place order.
  `,
  ERR_TRADING_ETHFX_CANT_APPROVE_USDT_TWICE:`
    You need to set allowance to 0 before approving this token.
  `,
  ERR_RELEASE_TOKENS_NONCE_REQUIRES_SIGNATURE:`
    When providing a nonce you should also provide a signature.
  `,
  ERR_TRADING_ETHFX_APPROVE_ETH_NOT_REQUIRED:`
    Approving ETH is not required.
  `,
  ERR_EFXAPI_ORDER_INVALID:`
    Invalid Order
  `,
  ERR_TRADING_ETHFX_TRUSTLESS_API_NECTAR_INVALID:`
    During Beta phase you are required to hold NEC in your personal wallet to trade.
  `,
}
