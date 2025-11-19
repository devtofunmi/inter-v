import { NextApiRequest, NextApiResponse } from "next";
import formidable, { File } from "formidable";
import fs from "fs";
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";

export const config = {
  api: { bodyParser: false },
};

export const runtime = "nodejs";

const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
  console.error('GEMINI_API_KEY is not set in the environment variables.');
}

const genAI = new GoogleGenerativeAI(API_KEY as string);

// Helper to convert file to generative part
function fileToGenerativePart(buffer: Buffer, mimeType: string) {
  return {
    inlineData: {
      data: buffer.toString("base64"),
      mimeType,
    },
  };
}

// ---------- Helper: parse form ----------
const parseForm = (req: NextApiRequest) => {
  const form = formidable({});
  return new Promise<{ fields: formidable.Fields; files: formidable.Files }>(
    (resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        else resolve({ fields, files });
      });
    }
  );
};

const uploadToCloudinary = async (filePath: string, mimeType: string | null) => {
    const fileBuffer = fs.readFileSync(filePath);
    const formData = new FormData();
    const blob = new Blob([fileBuffer], { type: mimeType ?? undefined });
    formData.append("file", blob, 'cv.pdf');
    formData.append("upload_preset", "users_avater");

    const response = await fetch(
        "https://api.cloudinary.com/v1_1/drirsnp0c/image/upload",
        {
            method: "POST",
            body: formData,
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error?.message || "Cloudinary upload failed");
    }
    console.log("File uploaded to Cloudinary:", data.secure_url);
    return data.secure_url;
};

// ---------- API Handler ----------
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ message: "Method not allowed" });
  }

  let uploadedFilePath: string | null = null;

  try {
    const { files } = await parseForm(req);
    const cvFiles = files.cv;

    if (!cvFiles) {
      return res.status(400).json({
        message: "No file uploaded. Please upload a CV."
      });
    }

    const fileArray = Array.isArray(cvFiles) ? cvFiles : [cvFiles];
    const file = fileArray[0] as File;

    uploadedFilePath = file.filepath;
    const mimeType = file.mimetype;

    if (!mimeType || !mimeType.startsWith("application/pdf")) {
        return res.status(400).json({
            message: "Unsupported file type. Only PDFs are allowed."
        });
    }

    await uploadToCloudinary(uploadedFilePath, mimeType);

    const fileBuffer = fs.readFileSync(uploadedFilePath);

    const model = genAI.getGenerativeModel({
        model: "gemini-2.0-flash",
        safetySettings: [
            {
                category: HarmCategory.HARM_CATEGORY_HARASSMENT,
                threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
            },
        ],
    });

    const filePart = fileToGenerativePart(fileBuffer, mimeType);

    const prompt = `
      You are an expert CV parser. Extract the following information from the attached CV and return it as a structured JSON object.
      The JSON object must have these keys: "name", "email", "skills", "professionalSummary", "experiences", "jobTitle".

      - "name": The full name of the person.
      - "email": The email address.
      - "skills": A string containing a comma-separated list of skills.
      - "professionalSummary": A string containing the professional summary, objective, or profile section.
      - "experiences": An array of objects. Each object represents a work experience and must have the keys "jobTitle", "startDate", "endDate", and "jobCategory".
        - If dates are not available, use empty strings.
        - "jobCategory" should be a general category like "Software Engineering", "Data Science", "Product Management", etc.
      - "jobTitle": The most recent job title.

      If any piece of information is not found, return an empty string for string fields or an empty array for the "experiences" field.
      Your response must be only the JSON object, with no other text or markdown formatting before or after it.
    `;

    const result = await model.generateContent([prompt, filePart]);
    const responseText = result.response.text();

    // Clean the response to ensure it's valid JSON
    const jsonString = responseText.replace(/```json/g, "").replace(/```/g, "").trim();

    const extractedData = JSON.parse(jsonString);

    return res.status(200).json(extractedData);
  } catch (err: unknown) {
    console.error("CV parsing error:", err);
    return res.status(500).json({
      message: "Error parsing the CV",
      error: err instanceof Error ? err.message : "Unknown error"
    });
  } finally {
    if (uploadedFilePath) {
      fs.unlink(uploadedFilePath, (unlinkErr) => {
        if (unlinkErr) {
          console.error("Error deleting temporary file:", unlinkErr);
        }
      });
    }
  }
}