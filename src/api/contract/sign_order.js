const sw = require('starkware_crypto');

module.exports = (starkKeyPair, starkMessage) => {
  
  let starkSignature=''
  if(!starkKeyPair || !starkMessage){
    throw('Stark key pair or stark message missing')
  }
  try{
		starkSignature = sw.sign(starkKeyPair, starkMessage);
	} catch (e) {
		throw('unable to sign');
  }
  return starkSignature
}
