const publicPermissionsDescriptor = await rhinofi.publicUserPermissions()

logExampleResult(publicPermissionsDescriptor)

// Get currently set permissions for a user, authenticated endpoint
const currentUerPermissions = await rhinofi.account.getPermissions()
logExampleResult(currentUerPermissions)

// Enable all of the permissions
Object.keys(currentUerPermissions).map(async (permissionKey) => {
  const updatedPermissions = await rhinofi.account.setPermissions({ key: permissionKey, value: true })
  logExampleResult(updatedPermissions)
})