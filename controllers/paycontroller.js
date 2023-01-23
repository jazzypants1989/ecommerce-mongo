const Square = require("square");
const v4 = require("uuid").v4;

const client = new Square.Client({
  environment: Square.Environment.Sandbox,
  accessToken: process.env.SQUARE_ACCESS_TOKEN,
});

const createPayment = async (req, res) => {
  const { nonce, amount } = req.body;
  const idempotencyKey = v4();

  try {
    const requestParams = {
      sourceId: nonce,
      amountMoney: {
        amount: amount,
        currency: "USD",
      },
      idempotencyKey: idempotencyKey,
    };

    const response = await client.paymentsApi.createPayment(requestParams);
    return {
      statusCode: 200,
      body: JSON.stringify(response),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify(error),
    };
  }
};

module.exports = {
  createPayment,
};

/* 
import { v4 as uuidv4 } from "uuid";
BigInt.prototype.toJSON = function () {
  return this.toString();
};

const { paymentsApi } = new Client({
  accessToken: process.env.SQUARE_ACCESS_TOKEN,
  environment: "sandbox",
});

export default async function handler(req, res) {
  if (req.method == "POST") {
    const { result } = await paymentsApi.createPayment({
      idempotencyKey: uuidv4(),
      sourceId: req.body.sourceId,
      amountMoney: {
        currency: "USD",
        amount: req.body.amount,
      },
    });
    console.log(result);
    res.status(200).json(result);
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
*/
