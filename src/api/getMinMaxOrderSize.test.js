const nock = require("nock");
const instance = require("./test/helpers/instance");
const _ = require("lodash");

const mockGetConf = require("./test/fixtures/getConf");

let dvf;

describe("dvf.getMinMaxOrderSize()", () => {
  beforeAll(async () => {
    mockGetConf();
    dvf = await instance();
  });

  it("Makes GET request to order-size API and gets response", async () => {
    const pair = 'ETH:USDT'

    const apiResponse = {
      minOrderSize: 0.05,
      maxOrderSize: 2000,
    };

    nock(dvf.config.api)
      .get(`/market-data/ticker/${pair}/order-size`)
      .reply(200, apiResponse);

    const response = await dvf.getMinMaxOrderSize(pair);

    expect(response).toEqual(apiResponse);
  });

  it("Makes GET request to order-size API with non suported pair and gets error response", async () => {
    const pair = 'ETH:USD' // incorrect

    const apiErrorResponse = {
      statusCode: 400,
      error: "Bad Request",
      message:
        '"symbol" must be one of [ETH:USDT, ZRX:USDT, ZRX:ETH, BTC:USDT, ETH:BTC, KON:RAD, KON:USDT, DAI:ETH, DAI:USDT, CUSDT:USDT, ETH:USDC]',
      validation: {
        source: "params",
        keys: ["symbol"],
      },
    };

    nock(dvf.config.api)
      .get(`/market-data/ticker/${pair}/order-size`)
      .reply(400, apiErrorResponse);

      try {
        await dvf.getMinMaxOrderSize(pair)
      } catch (e) {
        expect(e.error).toEqual(apiErrorResponse)
      }
  });
});
