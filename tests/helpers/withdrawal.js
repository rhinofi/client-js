const P = require('aigle')

const withdraw = async (dvf, token, amount, starkPrivateKey, waitToBeReady) => {
    try {
        const withdrawalResponse = await dvf.withdraw(token, amount, starkPrivateKey)

        if (!waitToBeReady) {
            return withdrawalResponse
        }

        await P.retry({ times: 120, interval: 120000 }, () => checkWithdrawalReady(dvf, token))
        return withdrawalResponse
        
    } catch (err) {
        console.error('Error on create withdrawal', err)
    }
}

const checkWithdrawalReady = async (dvf, token) => {
    const withdrawals = await dvf.getWithdrawals()
    console.log('checking withdrawal ready', withdrawals)
    const findReadyWithdrawal = list => list.some(item => item.status === 'ready' && item.token===token)

    if (!withdrawals.length || !findReadyWithdrawal(withdrawals)) {
      throw new Error(`Withdrawal not ready yet`)
    }
  }

module.exports = { withdraw }
