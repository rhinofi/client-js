const tokenContractAbi = require('../../src/api/contract/abi/token.abi')
const P = require('aigle')

const drip = async (dvf, tokenAddress, account) => {
    try {
        const tokenContract = getContract(dvf, tokenContractAbi, tokenAddress)
        const dripResponse = await tokenContract.methods.drip().send({ from: account });

        await P.retry({ times: 20, interval: 120000 }, () => checkERC20Balance(tokenContract, account))

        return dripResponse
    } catch (err) {
        console.error('Error on drip', err)
    }
}

const checkERC20Balance = async (ropstenContract, account) => {
    console.log('searching for ERC20 balance...')
    const balance = await ropstenContract.methods.balanceOf(account).call()
    console.log('ERC20 balance ->', balance)
    if (parseInt(balance) === 0) {
        throw new Error(
            `Unconfirmed balance`
          )
    }
    return parseInt(balance)
}
const getContract = (dvf, abi, tokenAddress) => {
    const { web3 } = dvf
    return new web3.eth.Contract(abi, tokenAddress)
}

module.exports = {
    drip
}