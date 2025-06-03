import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { imageData, fileName } = req.body;

  if (!imageData || !fileName) {
    return res.status(400).json({ message: "Missing imageData or fileName" });
  }

  try {
    // Path to your public/certificate folder
    const certFolder = path.join(process.cwd(), "public", "certificates");

    // Create folder if doesn't exist
    if (!fs.existsSync(certFolder)) {
      fs.mkdirSync(certFolder, { recursive: true });
    }

    // Full file path
    const filePath = path.join(certFolder, fileName);

    // Decode base64 and write file
    const buffer = Buffer.from(imageData, "base64");
    fs.writeFileSync(filePath, buffer);

    return res.status(200).json({ message: "File saved successfully", filePath: `/certificate/${fileName}` });
  } catch (error) {
    console.error("Error saving certificate", error);
    return res.status(500).json({ message: "Error saving certificate" });
  }
}
