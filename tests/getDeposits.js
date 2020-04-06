const getDepositsWithDVF = async dvf => {
  try {
    const getDepositsResponse = await dvf.getDeposits()

    return getDepositsResponse
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
}

exports.getDepositsWithDVF = getDepositsWithDVF
