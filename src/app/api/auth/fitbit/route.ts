import { NextResponse } from "next/server";
import pkceChallenge from "pkce-challenge";

export async function GET() {
  const { code_challenge, code_verifier } = await pkceChallenge();

  const redirectUri = `${process.env.NEXT_PUBLIC_URL}/api/auth/fitbit/callback`;
  // const fitbitAuthUrl = `https://www.fitbit.com/oauth2/authorize?response_type=code&client_id=${process.env.FITBIT_CLIENT_ID}&redirect_uri=${redirectUri}&scope=activity%20nutrition%20heartrate%20location%20profile&code_challenge=${code_challenge}&code_challenge_method=S256`;
  const fitbitAuthUrl = `https://www.fitbit.com/oauth2/authorize?response_type=code&client_id=${process.env.FITBIT_CLIENT_ID}&scope=activity+cardio_fitness+electrocardiogram+heartrate+location+nutrition+oxygen_saturation+profile+respiratory_rate+settings+sleep+social+temperature+weight&redirect_uri=${redirectUri}&code_challenge=${code_challenge}&code_challenge_method=S256`;
  // クッキーに code_verifier を保存
  const response = NextResponse.redirect(fitbitAuthUrl);
  response.cookies.set("code_verifier", code_verifier, { httpOnly: true });

  return response;
}
