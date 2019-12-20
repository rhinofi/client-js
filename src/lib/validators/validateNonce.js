const errorReasons = require('../error/reasons');

module.exports = nonce => {
	if (!nonce || isNaN(nonce)) {
		return {
			error: 'ERR_INVALID_NONCE',
			reason: errorReasons.ERR_TOKEN_MISSING || 'ERR_TOKEN_MISSING',
		};
	}
	if (Date.now() - nonce > 1000) {
		return {
			error: 'NONCE_IS_TOO_OLD',
			reason: errorReasons.NONCE_IS_TOO_OLD || 'NONCE_IS_TOO_OLD',
		};
	}
};
