module.exports = isBrowser => {
  if (isBrowser) {
    const Transport = require('@ledgerhq/hw-transport-webhid').default
    return Transport
  } else {
    const Transport = require('@ledgerhq/hw-transport-node-hid').default
    return Transport
  }
}
