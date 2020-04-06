const { setup } = require('./helpers/setup')
const { register, skipRegister } = require("./helpers/register")
const { deposit } = require('./helpers/deposit')
const { withdraw } = require('./helpers/withdrawal')
   
const sleep = async time => new Promise(resolve => setTimeout(resolve, time || 1000));

describe('00 - Complete Path', () => {
    it('Setup - Register - Deposit - Withdraw', async () => {
        const account = await setup()
        expect(account.INFURA_PROJECT_ID).toEqual(process.env.INFURA_PROJECT_ID)
        expect(account.ETH_PRIVATE_KEY).toEqual(account.account.privateKey)
        expect(account.account.address).not.toBeNull()
        expect(account.account.privateKey).not.toBeNull()


        const dvf = await register(account)
        expect(dvf).not.toBeNull()

        const token = 'ETH'

        expect((await dvf.getDeposits()).length).toEqual(0)
        expect((await dvf.getWithdrawals()).length).toEqual(0)

        const depositResponse = await deposit(dvf, token, 0.95, account.ETH_PRIVATE_KEY)
        console.log('deposit response ->', depositResponse)

        const waitWithdrawToBeReady = true
        const withdrawal = await withdraw(dvf, token, 0.5, account.ETH_PRIVATE_KEY, waitWithdrawToBeReady)
        console.log("withdraw", withdrawal)

        const getBalanceResponse = await dvf.getBalance()
        console.log('getBalance response ->', getBalanceResponse)
        expect(getBalanceResponse[0].balance).toEqual('45000000')
        expect(getBalanceResponse[0].available).toEqual('45000000')

        // for a short period the withdrawals will be duplicated on the db until our server finish sync
        await sleep(50000)

        const withdrawals = await dvf.getWithdrawals()
        expect(withdrawals.length).toEqual(1)

        const withdrawOnchainResponse = await dvf.withdrawOnchain(token)
        console.log('withdrawOnchain response ', withdrawOnchainResponse)
        expect(withdrawOnchainResponse.transactionHash).toMatch('0x')

        await sleep(10000)
        const emptyWithdrawals = await dvf.getWithdrawals()
        expect(emptyWithdrawals.length).toEqual(0)        
    })
})