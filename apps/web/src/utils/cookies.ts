"use server";
import { cookies } from "next/headers";

interface StoreTokenRequest {
  token: string;
  refreshToken?: string;
}

export async function storeToken(request: StoreTokenRequest) {
  // Use secure cookies only in production (HTTPS)
  const isProduction = process.env.NODE_ENV === "production";

  (await cookies()).set({
    name: "accessToken",
    value: request.token,
    httpOnly: true,
    sameSite: "strict",
    secure: isProduction, // Only secure in production
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

export const getToken = async (): Promise<string | undefined> => {
  return (await cookies()).get("accessToken")?.value;
};

export const hasToken = async (): Promise<boolean> => {
  return Boolean((await cookies()).get("accessToken")?.value);
};

export const deleteToken = async (): Promise<void> => {
  (await cookies()).delete("accessToken");
};

