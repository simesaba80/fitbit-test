import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { URLSearchParams } from "url";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const code_verifier = request.cookies.get("code_verifier");

  if (!code || !code_verifier) {
    console.error("Authorization code or code verifier not found");
    return NextResponse.redirect("/");
  }

  try {
    // Construct URLSearchParams
    const params = new URLSearchParams({
      client_id: process.env.FITBIT_CLIENT_ID || "",
      grant_type: "authorization_code",
      redirect_uri: `${process.env.NEXT_PUBLIC_URL}/api/auth/fitbit/callback`,
      code,
      code_verifier: code_verifier.value || "",
    });

    // Request token from Fitbit API
    const tokenResponse = await axios.post(
      "https://api.fitbit.com/oauth2/token",
      params.toString(),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${Buffer.from(
            `${process.env.FITBIT_CLIENT_ID}:${process.env.FITBIT_CLIENT_SECRET}`
          ).toString("base64")}`,
        },
      }
    );

    const token = tokenResponse.data.access_token;
    console.log("Access Token:", token);

    // Return a simple response with the token for debugging purposes
    return new NextResponse(`Access Token: ${token}`, { status: 200 });
  } catch (error: any) {
    console.error(
      "Error obtaining token:",
      error.response?.data || error.message
    );
    return new NextResponse(`Error: ${error.response?.data || error.message}`, {
      status: 500,
    });
  }
}
