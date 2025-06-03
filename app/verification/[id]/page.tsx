import Image from "next/image";
import React from "react";

interface VerificationData {
  Name: string;
  Role: string;
  Affiliation: string;
  Conference_Name: string;
  Year: string;
  Purpose: string;
  Issue_Date: string;
}

export default async function VerificationPage({
  params,
}: {
  params: { id: string };
}) {
  const id = params.id;

  let data: VerificationData | null = null;
  let error: string = "";

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/verifications/${id}`,
      { cache: "no-store" }
    );
    if (!res.ok) throw new Error("Certificate not found");

    const result = await res.json();
    const raw = result?.data;

    if (!raw) throw new Error("Invalid certificate data");

    const issueDate = new Date(raw.publishedAt).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    data = {
      Name: raw.Name,
      Role: raw.Role,
      Affiliation: raw.Affiliation,
      Conference_Name: raw.Conference_Name,
      Year: raw.Year,
      Purpose: raw.Purpose,
      Issue_Date: issueDate,
    };
  } catch (err: any) {
    error = err.message || "Something went wrong";
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto mt-20 px-4 text-center">
        <div className="bg-red-50 border border-red-300 text-red-700 p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-2">
            ❌ Verification Failed
          </h2>
          <p className="text-sm text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto mt-16 px-4 py-10 bg-white border border-gray-200 shadow-xl rounded-2xl">
  {/* Verified Badge Section */}
  <div className="text-center mb-10 bg-green-50 rounded-xl shadow-md border border-green-200 p-2">
    <div className="flex flex-col items-center space-y-4">
      <div className=" rounded-full p-4 animate-pulse">
        <Image
          src="/images/verified.gif"
          alt="verified"
          width={72}
          height={72}
          className="rounded-full"
        />
      </div>

      <h1 className="text-4xl font-extrabold text-green-700 drop-shadow-md">
        Verified
      </h1>

      <p className="text-green-900 text-lg  leading-relaxed mx-auto">
        This certificate is authentic and has been validated.
      </p>
    </div>
  </div>

  {/* Information Section */}
  <div className="border-t border-gray-200 pt-6 space-y-5 text-gray-700 text-base">
    <InfoRow label="Name" value={data.Name} />
    <InfoRow label="Role" value={data.Role} />
    <InfoRow label="Affiliation" value={data.Affiliation} />
    <InfoRow label="Conference" value={data.Conference_Name} />
    <InfoRow label="Year" value={data.Year} />
    <InfoRow label="Purpose" value={data.Purpose} />
    <InfoRow label="Issue Date" value={data.Issue_Date} />
  </div>
</div>

  );
}

// InfoRow with larger key and smaller value
function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-start border-b pb-2">
      <span className="text-base font-semibold text-gray-800">{label}:</span>
      <span className="text-sm text-gray-600 text-right max-w-[60%]">
        {value}
      </span>
    </div>
  );
}
