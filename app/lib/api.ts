// lib/api.ts or inside your component

import { VerificationEntry, VerificationResponse } from "@/types/verification";

export const storeVerification = async (
  payload: VerificationEntry
): Promise<VerificationResponse> => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/verifications`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data: payload }),
      }
    );

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.error?.message || "Failed to store verification");
    }

    return { data: result };
  } catch (error: any) {
    console.error("Store verification failed:", error);
    return { data: null, error };
  }
};
