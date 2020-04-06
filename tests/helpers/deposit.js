const P = require('aigle')

const deposit = async (dvf, token, amount, starkPrivKey) => {
    try {
        const depositResponse = await dvf.deposit(token, amount, starkPrivKey)

        await P.retry({ times: 20, interval: 30000 }, () => checkBalance(dvf))

        return depositResponse
    } catch (err) {
        console.error('Error on create deposit', err)
    }
}

const checkBalance = async dvf => {
    console.log('searching for balances...')
    const balances = await dvf.getBalance()
    console.log('balances', balances)
    if (!balances.length) {
        throw new Error(
            `Unconfirmed balance`
          )
    }
}

module.exports = {
    deposit
}