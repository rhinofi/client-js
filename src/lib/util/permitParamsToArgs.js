
module.exports = permitParams => {
  if (!permitParams) {
    return []
  }
  const {permitValue, deadline, v, r, s} = permitParams
  return [
    permitValue, deadline, v, r, s
  ]
}
