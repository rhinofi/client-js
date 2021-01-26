const msPerHour = 1000 * 3600

module.exports = dvf => {
  const nowHours = Math.ceil(Date.now() / msPerHour)

  return nowHours + parseInt(dvf.config.defaultStarkExpiry)
}
