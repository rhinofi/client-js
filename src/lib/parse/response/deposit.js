const parseError = require('../error');

module.exports = async (request) => {
  try {
    const response = await request;

    return response;
  } catch (error) {

    // if it's not a HTTP response error,
    // throw the error
    if (!error.response) {
      throw error
    }

    return parseError(error.response.body);
  }
}
