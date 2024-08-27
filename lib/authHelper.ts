import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export function checkAuth() {
  const token = cookies().get("token")?.value;

  console.log("Token retrieved from cookies:", token);

  if (!token) {
    console.log("No token found.");
    return false;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    console.log("Token successfully verified:", decoded);
    return true;
  } catch (error) {
    console.log("Token verification failed:", error);
    return false;
  }
}
