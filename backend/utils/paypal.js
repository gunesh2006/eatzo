import axios from "axios";
const PAYPAL_API = "https://api-m.sandbox.paypal.com";

export const getPaypalAccessToken = async () => {
  const res = await axios({
    url: `${PAYPAL_API}/v1/oauth2/token`,
    method: "post",
    data: "grant_type=client_credentials",
    auth: {
      username: process.env.PAYPAL_CLIENT_KEY,
      password: process.env.PAYPAL_SECRET_KEY,
    },
  });
  return res.data.access_token;
};

export const createPaypalOrder = async (amount) => {
  const token = await getPaypalAccessToken();

  const res = await axios.post(
    `${PAYPAL_API}/v2/checkout/orders`,
    {
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: "USD",
            value: amount,
          },
        },
      ],
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return res.data;
};

export const capturePaypalOrder = async (orderId) => {
  const token = await getPaypalAccessToken();

  const res = await axios.post(
    `${PAYPAL_API}/v2/checkout/orders/${orderId}/capture`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return res.data;
};
