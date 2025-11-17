import { NextApiRequest, NextApiResponse } from "next";
import formidable, { File } from "formidable";
import fs from "fs";
import { getDocument, PDFDocumentProxy, PDFPageProxy, PDFTextContent } from "pdfjs-dist/legacy/build/pdf.mjs";

export const config = {
  api: { bodyParser: false },
};

export const runtime = "nodejs";

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

// ---------- Helper: extract sections ----------
const getSectionText = (text: string, sectionTitles: string[]): string => {
  const allSectionHeaders = [
    "Skills", "Technical Skills", "Experience", "Work Experience",
    "Education", "Projects", "Summary", "Objective", "Profile",
    "Contact", "Awards",
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
  
  let endIndex = text.length;

  for (const header of allSectionHeaders) {
    if (sectionTitles.some(s => s.toLowerCase() === header.toLowerCase())) continue;

    const regex = new RegExp(`^\\s*${header}\\s*$`, "im");
    const match = text.slice(startIndex).match(regex);
    
    if (match && match.index !== undefined) {
      const absoluteIndex = startIndex + match.index;
      if (absoluteIndex < endIndex) {
        endIndex = absoluteIndex;
      }
    }
  }

  return text.slice(startIndex, endIndex).trim();
};

// ---------- Helper: extract job category ----------
const extractJobCategory = (jobTitle: string): string => {
  const categories = [
    "Software", "Engineering", "Software Engineer", "Frontend Developer",
    "Backend Developer", "Data", "Cloud", "DevOps", "Security", "Networking",
    "Support", "Sales", "Marketing", "Product", "Design", "HR",
    "Finance", "Legal", "Other"
  ];

  const lower = jobTitle.toLowerCase();
  for (const category of categories) {
    if (lower.includes(category.toLowerCase())) return category;
  }
  return "Other";
};

// ---------- Helper: parse experiences ----------
interface Experience {
  jobTitle: string;
  startDate: string;
  endDate: string;
  jobCategory: string;
}

const parseExperiences = (text: string): Experience[] => {
  if (!text) return [];

  const lines = text.trim().split("\n");
  const results: Experience[] = [];
  let currentExperience: Partial<Experience> = {};

  const dateRegex =
    /(\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|January|February|March|April|May|June|July|August|September|October|November|December)[\s.]*\d{4})\s*[-–—to]\s*(\bPresent\b|\bCurrent\b|\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|January|February|March|April|May|June|July|August|September|October|November|December)[\s.]*\d{4})/i;

  for (const line of lines) {
    const trimmedLine = line.trim();
    if (!trimmedLine) continue;

    const dateMatch = trimmedLine.match(dateRegex);

    if (dateMatch) {
      if (currentExperience.jobTitle) {
        results.push(currentExperience as Experience);
        currentExperience = {};
      }
      currentExperience.startDate = dateMatch[1].trim();
      currentExperience.endDate = dateMatch[2].trim();
    } else if (trimmedLine.length > 2) {
      if (!currentExperience.jobTitle) {
        currentExperience.jobTitle = trimmedLine;
        currentExperience.jobCategory = extractJobCategory(trimmedLine);
      }
    }
  }

  if (currentExperience.jobTitle) {
    results.push(currentExperience as Experience);
  }

  return results;
};

// ---------- Helper: extract text from PDF ----------
const extractTextFromPDF = async (fileBuffer: Buffer): Promise<string> => {
  // ✅ Convert Node.js Buffer to Uint8Array
  const uint8Array = new Uint8Array(fileBuffer);

  const loadingTask = getDocument({ data: uint8Array });
  const pdf: PDFDocumentProxy = await loadingTask.promise;

  let fullText = "";
  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page: PDFPageProxy = await pdf.getPage(pageNum);
    const content: PDFTextContent = await page.getTextContent();
    const pageText = content.items.map(item => item.str).join(" ");
    fullText += pageText + "\n";
  }
  return fullText;
};


// ---------- API Handler ----------
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ message: "Method not allowed" });
  }

  let uploadedFilePath: string | null = null;

  try {
    const { files } = await parseForm(req);
    const cvFiles = files.cv;

    if (!cvFiles) {
      return res.status(400).json({ message: "No file uploaded. Please upload a CV." });
    }

    const file = (Array.isArray(cvFiles) ? cvFiles[0] : cvFiles) as File;
    uploadedFilePath = file.filepath;

    if (file.mimetype !== "application/pdf") {
      return res.status(400).json({ message: "Only PDFs are allowed." });
    }

    const fileBuffer = fs.readFileSync(uploadedFilePath);

    // ✅ Extract text using pdfjs-dist
    const text = await extractTextFromPDF(fileBuffer);
    console.log("Extracted Text:", text);

    const emailMatch = text.match(/[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+/);
    const email = emailMatch?.[0].trim() || "";

    let name = "";
    if (email) {
      const lines = text.split("\n");
      const lineIndex = lines.findIndex(line => line.includes(email));

      if (lineIndex !== -1) {
        const nameLine = lines[lineIndex];
        const nameMatch = nameLine.match(/([A-Z][a-zA-Z'-]+(?:\s[A-Z][a-zA-Z'-]+)+)/);
        if (nameMatch) {
          name = nameMatch[0].trim();
        } else if (lineIndex > 0) {
          const prevLine = lines[lineIndex - 1];
          const prevNameMatch = prevLine.match(/([A-Z][a-zA-Z'-]+(?:\s[A-Z][a-zA-Z'-]+)+)/);
          if (prevNameMatch) {
            name = prevNameMatch[0].trim();
          }
        }
      }
    }

    if (!name) {
      const nameMatch = text.match(/^\s*([A-Z][a-zA-Z'-]+(?:\s[A-Z][a-zA-Z'-]+)+)/m);
      if (nameMatch) {
        name = nameMatch[0].trim();
      }
    }

    const summary = getSectionText(text, ["Summary", "Profile", "Objective"]);
    const skills = getSectionText(text, ["Skills", "Technical Skills"]);
    const experienceText = getSectionText(text, ["Experience", "Work Experience"]);
    const experiences = parseExperiences(experienceText);

    const jobTitle = experiences[0]?.jobTitle || "";

    console.log("Name:", name);
    console.log("Email:", email);
    console.log("Skills:", skills);
    console.log("Professional Summary:", summary);
    console.log("Experiences:", experiences);

    return res.status(200).json({
      name,
      email,
      skills,
      professionalSummary: summary,
      experiences,
      jobTitle,
    });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    console.error("CV parsing error:", err);
    return res.status(500).json({
      message: "Failed to extract data from CV.",
      error: errorMessage,
    });
  } finally {
    if (uploadedFilePath) fs.unlink(uploadedFilePath, () => {});
  }
}