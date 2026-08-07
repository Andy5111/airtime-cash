exports.handler = async function(event, context) {
  // Only allow POST requests
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed" })
    };
  }

  try {
    const data = JSON.parse(event.body);
    const { network, amount, phone } = data;

    // Basic validation
    if (!network || !amount || !phone) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing required fields" })
      };
    }

    // For now we return a test response
    // Later we will connect the real AirtimeToCash API here
    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: "Function received your request successfully",
        received: {
          network: network,
          amount: amount,
          phone: phone
        },
        note: "Real API connection will be added in the next step"
      })
    };

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Something went wrong" })
    };
  }
};
