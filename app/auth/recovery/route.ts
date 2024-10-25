import { type EmailOtpType } from "@supabase/supabase-js";
import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/app/utils/supabase/server";

// Creating a handler for a GET request to route /auth/recover
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token"); // Get the token from URL
  const type = searchParams.get("type") as EmailOtpType | null;
  const email = searchParams.get("email"); // Ensure the email is passed as a query parameter
  const next = "/nytt-losenord"; // Where you want the user to be redirected after verification

  // Create redirect link without the secret token
  const redirectTo = request.nextUrl.clone();
  redirectTo.pathname = next;
  redirectTo.searchParams.delete("token");
  redirectTo.searchParams.delete("type");
  redirectTo.searchParams.delete("email");

  if (token && type && email) {
    const supabase = createClient();

    // Check if the OTP type is for recovery
    if (type === 'recovery') {
      // Verify the OTP for password recovery
      const { error } = await supabase.auth.verifyOtp({
        type: 'recovery', // Explicitly pass the recovery type
        token,
        email, // Email is required for recovery type
      });

      if (!error) {
        return NextResponse.redirect(redirectTo); // Successful verification
      }
    }
  }

  // If the token is invalid or expired, redirect to an error page
  redirectTo.pathname = "/error";
  return NextResponse.redirect(redirectTo);
}
