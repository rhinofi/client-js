module.exports = isBrowser => {
  if (isBrowser) {
    const Transport = require('@ledgerhq/hw-transport-webusb').default
    return Transport
  } else {
      const Transport = require('@ledgerhq/hw-transport-node-hid').default
      return Transport
    }
}

