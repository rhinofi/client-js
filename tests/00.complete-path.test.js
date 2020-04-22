const { setup } = require('./helpers/setup')
const { register } = require("./helpers/register")
const { deposit } = require('./helpers/deposit')
const { withdraw } = require('./helpers/withdrawal')
const { drip } = require('./helpers/drip')

const sleep = async time => new Promise(resolve => setTimeout(resolve, time * 1000 || 10000));

const runOrderTests = async (dvf, privateKey, sellToken, buyToken, amount, price) => {
    const submitOrderResponse = await dvf.submitOrder({
        symbol: `${sellToken}:${buyToken}`,
        amount,
        price,
        starkPrivateKey: privateKey
    })
    console.log('submitOrder response ->', submitOrderResponse)

    expect(submitOrderResponse.type).toEqual('EXCHANGE LIMIT')
    expect(submitOrderResponse.tokenSell).toEqual(sellToken)
    expect(submitOrderResponse.tokenBuy).toEqual(buyToken)

    await sleep(20)
    
    const orders = await dvf.getOrders()
    console.log('getOrders response ->', orders)
    expect(orders.length).toEqual(1)
    
    const createdOrder = orders.find(order => order.meta.orderId === submitOrderResponse._id)
    expect(createdOrder.status).toEqual('ACTIVE')
    expect(createdOrder.price).toEqual(price)

    const cancelOrderResponse = await dvf.cancelOrder(submitOrderResponse._id)
    console.log('cancelOrder response ->', cancelOrderResponse)

    expect((await dvf.getOrders()).length).toEqual(0)
} 

describe('00 - Complete Path', () => {
    it('Setup - Register - Deposit - Manage Orders - Withdraw - Token', async () => {
        const setupResponse = await setup()
        const { ETH_PRIVATE_KEY, INFURA_PROJECT_ID, account } = setupResponse
        const { address, privateKey } = account
        
        expect(INFURA_PROJECT_ID).toEqual(process.env.INFURA_PROJECT_ID)
        expect(ETH_PRIVATE_KEY).toEqual(privateKey)
        expect(address).not.toBeNull()
        expect(privateKey).not.toBeNull()
        
        console.log('account ->', setupResponse)
        
        const dvf = await register(setupResponse)
        expect(dvf).not.toBeNull()
        
        expect((await dvf.getDeposits()).length).toEqual(0)

        let token = 'ETH'

        const depositResponse = await deposit(dvf, token, 0.95, privateKey)
        console.log('deposit response ->', depositResponse)

        await runOrderTests(dvf, privateKey, token, 'USDT', -0.3, 250)

        expect((await dvf.getWithdrawals()).length).toEqual(0)

        const waitWithdrawToBeReady = true
        const withdrawal = await withdraw(dvf, token, 0.5, privateKey, waitWithdrawToBeReady)
        console.log("withdraw", withdrawal)

        const getBalanceResponse = await dvf.getBalance()
        console.log('getBalance response ->', getBalanceResponse)
        expect(getBalanceResponse[0].balance).toEqual('45000000')
        expect(getBalanceResponse[0].available).toEqual('45000000')

        // for a short period the withdrawals will be duplicated on the db until our server finish sync
        await sleep(50)

        const withdrawals = await dvf.getWithdrawals()
        expect(withdrawals.length).toEqual(1)

        const withdrawOnchainResponse = await dvf.withdrawOnchain(token)
        console.log('withdrawOnchain response ', withdrawOnchainResponse)
        expect(withdrawOnchainResponse.transactionHash).toMatch('0x')

        await sleep(10)
        const emptyWithdrawals = await dvf.getWithdrawals()
        expect(emptyWithdrawals.length).toEqual(0)

        // testing same path for a token
        token = 'USDT'

        // get some tokens from the faucet
        await drip(dvf, dvf.config.tokenRegistry[token].tokenAddress, address)

        await dvf.contract.approve(token)
        const tokenDepositResponse = await deposit(dvf, token, 100, privateKey)
        console.log('token deposit response ->', tokenDepositResponse)

        await runOrderTests(dvf, privateKey, 'ETH', token, -250, 0.3)

        const tokenWithdrawal = await withdraw(dvf, token, 50, privateKey, waitWithdrawToBeReady)
        console.log("tokenWithdrawal", tokenWithdrawal)

        // for a short period the withdrawals will be duplicated on the db until our server finish sync
        await sleep(50)

        const tokenWithdrawOnchainResponse = await dvf.withdrawOnchain(token)
        console.log('tokenWithdrawOnchain response ', withdrawOnchainResponse)
        expect(tokenWithdrawOnchainResponse.transactionHash).toMatch('0x')

        await sleep(10)
        expect((await dvf.getWithdrawals()).length).toEqual(0)        
    })
})