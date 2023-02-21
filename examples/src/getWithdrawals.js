// Get withtrawals for all tokens
const token = undefined
// And current user
const userAddress = rhinofi.get('account')
const getWithdrawalsResponse = await rhinofi.getWithdrawals(token, userAddress)

logExampleResult(getWithdrawalsResponse)