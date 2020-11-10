const getPriceFromOrderBook = (data = []) => {
  try {
    if (!data.length || !data[0] || !data[0][1]) {
      console.log("Error getting order book from api")
      return null;
    }

    return data[0][1]
  } catch (e) {
    return null
  }
};


module.exports = getPriceFromOrderBook;
