exports.handler = async function(event, context) {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed" })
    };
  }

  try {
    const data = JSON.parse(event.body);
    const { action, network, amount, phone, otp } = data;
    const token = process.env.AIRTIME_API_TOKEN;

    // Generate OTP
    if (action === "generate_otp") {
      const response = await fetch("https://automation.airtimetocash.com/api/v1/generate/otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": "Bearer " + token
        },
        body: JSON.stringify({
          networkName: network,
          sender: phone
        })
      });

      const result = await response.json();

      return {
        statusCode: 200,
        body: JSON.stringify({
          success: true,
          action: "generate_otp",
          apiResponse: result
        })
      };
    }

    // Verify OTP
    if (action === "verify_otp") {
      const response = await fetch("https://automation.airtimetocash.com/api/v1/verify/otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": "Bearer " + token
        },
        body: JSON.stringify({
          networkName: network,
          sender: phone,
          otp: otp
        })
      });

      const result = await response.json();

      return {
        statusCode: 200,
        body: JSON.stringify({
          success: true,
          action: "verify_otp",
          apiResponse: result
        })
      };
    }

    // Default - Check Quota
    const response = await fetch("https://automation.airtimetocash.com/api/v1/check/quota/availability", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": "Bearer " + token
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
        action: "check_quota",
        apiResponse: result
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
