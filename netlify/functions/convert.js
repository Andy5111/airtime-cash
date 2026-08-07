exports.handler = async function(event, context) {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed" })
    };
  }

  try {
    const data = JSON.parse(event.body);
    const { network, amount, phone } = data;

    if (!network || !amount || !phone) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing required fields" })
      };
    }

    const token = process.env.AIRTIME_API_TOKEN;

    // First we check if conversion is available for this network and amount
    const response = await fetch("https://automation.airtimetocash.com/api/v1/check/quota/availability", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
        networkName: network,
        amount: Number(amount)
      })
    });

    const result = await response.json();

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: "Quota check completed",
        apiResponse: result,
        received: {
          network: network,
          amount: amount,
          phone: phone
        }
      })
    };

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: "Something went wrong",
        details: error.message 
      })
    };
  }
};
