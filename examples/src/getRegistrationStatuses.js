const registrationStatusesResponse = await rhinofi.getRegistrationStatuses({
  targetEthAddress: '0x08152c1265dbc218ccc8ab5c574e6bd52279b3b7'
})

logExampleResult(registrationStatusesResponse)