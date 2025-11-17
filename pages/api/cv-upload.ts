import { NextApiRequest, NextApiResponse } from "next";
import formidable, { File } from "formidable";
import fs from "fs";
// import pdf from "pdf-parse";
import { PDFParse } from "pdf-parse";

export const config = {
  api: { bodyParser: false },
};

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

const getSectionText = (text: string, sectionTitles: string[]): string => {
  const allSectionHeaders = [
    "Skills",
    "Technical Skills",
    "Experience",
    "Work Experience",
    "Education",
    "Projects",
    "Summary",
    "Objective",
    "Profile",
    "Contact",
    "Awards",
  ];

  let startMatch: RegExpMatchArray | null = null;
  let foundTitle = "";

  for (const title of sectionTitles) {
    const startRegex = new RegExp(`^\\s*${title}\\s*$`, "im");
    startMatch = text.match(startRegex);
    if (startMatch) {
      foundTitle = title;
      break;
    }
  }

  if (!startMatch || startMatch.index === undefined) return "";

  const startIndex = startMatch.index + startMatch[0].length;
  const remaining = text.slice(startIndex);
  let endIndex = text.length;

  for (const header of allSectionHeaders) {
    if (header.toLowerCase() === foundTitle.toLowerCase()) continue;

    const regex = new RegExp(`^\\s*${header}\\s*$`, "im");
    const match = remaining.match(regex);

    if (match && match.index !== undefined) {
      const absoluteIndex = startIndex + match.index;
      if (absoluteIndex < endIndex) endIndex = absoluteIndex;
    }
  }

  return text.slice(startIndex, endIndex).trim();
};

const extractJobCategory = (jobTitle: string): string => {
  const categories = [
    "Software", "Engineering", "Software Engineer", "Frontend Developer", "Backend Developer", "Data", "Cloud", "DevOps", "Security", "Networking",
    "Support", "Sales", "Marketing", "Product", "Design", "HR", 
    "Finance", "Legal", "Other"
  ];
  const lowerCaseJobTitle = jobTitle.toLowerCase();
  for (const category of categories) {
    if (lowerCaseJobTitle.includes(category.toLowerCase())) {
      return category;
    }
  }
  return "Other";
};

const parseExperiences = (text: string) => {
  if (!text) return [];

  const entries = text.split(/\n\s*\n/).filter(p => p.trim() !== '');
  const experienceList: { jobTitle: string; startDate: string; endDate: string; jobCategory: string }[] = [];
  const dateRegex = /(\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|January|February|March|April|May|June|July|August|September|October|November|December)[\s.]*\d{4})\s*[-–—to]\s*(\bPresent\b|\bCurrent\b|\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|January|February|March|April|May|June|July|August|September|October|November|December)[\s.]*\d{4})/i;

  for (const entry of entries) {
    const lines = entry.trim().split('\n').map(line => line.trim());
    if (lines.length === 0) continue;

    let jobTitle = lines[0];
    let startDate = '';
    let endDate = '';

    const dateMatch = entry.match(dateRegex);
    if (dateMatch) {
      startDate = dateMatch[1].trim();
      endDate = dateMatch[2].trim();
      if (lines[0].includes(dateMatch[0])) {
        jobTitle = lines[0].replace(dateMatch[0], '').trim();
      }
    }
    
    if (jobTitle) {
        const cleanedJobTitle = jobTitle.split(/ at | \| /)[0].trim();
        const jobCategory = extractJobCategory(cleanedJobTitle);
        experienceList.push({
            jobTitle: cleanedJobTitle,
            startDate,
            endDate,
            jobCategory,
        });
    }
  }
  return experienceList;
}

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
    // Parse file upload
    const { files } = await parseForm(req);
    const cvFiles = files.cv;

    if (!cvFiles) {
      return res.status(400).json({
        message: "No file uploaded. Please upload a CV.",
      });
    }

    const fileArray = Array.isArray(cvFiles) ? cvFiles : [cvFiles];
    const file = fileArray[0] as File;

    uploadedFilePath = file.filepath;

    // Validate file type
    if (file.mimetype !== "application/pdf") {
      return res
        .status(400)
        .json({ message: "Unsupported file type. Only PDFs are allowed." });
    }

    // Read and parse PDF
    const fileBuffer = fs.readFileSync(uploadedFilePath);
    const parser = new PDFParse({ data: fileBuffer });
    const pdfData = await parser.getText();
    await parser.destroy();
    const text: string = pdfData.text;

    // Extract name + email
    const nameMatch = text.match(
      /^\s*([A-Z][a-zA-Z'-]+(?:\s[A-Z][a-zA-Z'-]+)+)/m
    );
    const emailMatch = text.match(
      /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/
    );

    // Extract sections
    const professionalSummary = getSectionText(text, [
      "Summary",
      "Profile",
      "Objective",
    ]);
    const skills = getSectionText(text, ["Skills", "Technical Skills"]);
    const experienceText = getSectionText(text, ["Experience", "Work Experience"]);
    const experiences = parseExperiences(experienceText);
    const jobTitle = experiences.length > 0 ? experiences[0].jobTitle : "";

    const extractedData = {
      name: nameMatch ? nameMatch[0].trim() : "",
      email: emailMatch ? emailMatch[0].trim() : "",
      skills,
      professionalSummary,
      experiences,
      jobTitle,
    };

    return res.status(200).json(extractedData);
  } catch (err: unknown) {
    console.error("CV parsing error:", err);

    return res.status(500).json({
      message: "Error parsing the CV",
      error: err instanceof Error ? err.message : "Unknown error",
    });
  } finally {
    if (uploadedFilePath) {
      fs.unlink(uploadedFilePath, () => {});
    }
  }
}
