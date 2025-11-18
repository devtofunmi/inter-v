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
        "Skills", "Technical Skills", "Experience", "Work Experience", "Education",
        "Projects", "Summary", "Objective", "Profile", "Contact", "Awards",
        "Publications", "Certifications", "Languages", "Interests", "References"
    ];

    const sections: {title: string, index: number, match: string}[] = [];
    allSectionHeaders.forEach(header => {
        const regex = new RegExp(`^\\s*${header}\\s*[:]?\\s*$`, "igm");
        let match;
        while ((match = regex.exec(text)) !== null) {
            sections.push({ title: header, index: match.index, match: match[0] });
        }
    });

    sections.sort((a, b) => a.index - b.index);

    let targetSectionIndex = -1;
    let targetSectionWithTitle;

    for (const title of sectionTitles) {
        const foundSection = sections.find(s => s.title.toLowerCase() === title.toLowerCase());
        if (foundSection) {
            targetSectionIndex = sections.indexOf(foundSection);
            targetSectionWithTitle = foundSection;
            break;
        }
    }

    if (targetSectionIndex === -1 || !targetSectionWithTitle) return "";

    const contentStartIndex = targetSectionWithTitle.index + targetSectionWithTitle.match.length;

    const nextSection = sections[targetSectionIndex + 1];
    const contentEndIndex = nextSection ? nextSection.index : text.length;

    return text.substring(contentStartIndex, contentEndIndex).trim();
};

// ---------- Helper: extract job category ----------
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

// ---------- Helper: parse experiences ----------
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
    
    // Filter for items that are actual text and have transform data
    const textItems = content.items.filter(
      (item): item is { str: string; transform: number[] } => 'str' in item && 'transform' in item
    );

    // The items are not guaranteed to be in order, sort them by their transform
    textItems.sort((a, b) => {
        if (a.transform[5] > b.transform[5]) return -1; // Higher y-coordinate first (top of page)
        if (a.transform[5] < b.transform[5]) return 1;
        if (a.transform[4] < b.transform[4]) return -1; // Lower x-coordinate first (left to right)
        if (a.transform[4] > b.transform[4]) return 1;
        return 0;
    });

    let lastY = -1;
    let line = '';
    for (const item of textItems) {
        if (lastY !== -1 && Math.abs(item.transform[5] - lastY) > 5) { // New line
            fullText += line.trim() + '\n';
            line = '';
        }
        line += item.str + ' ';
        lastY = item.transform[5];
    }
    fullText += line.trim() + '\n';
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
    const text = await extractTextFromPDF(fileBuffer);
    
    console.log("--- Extracted Text from PDF ---");
    console.log(text);
    console.log("-----------------------------");

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

    console.log("--- Extracted Sections ---");
    console.log("Name:", extractedData.name);
    console.log("Email:", extractedData.email);
    console.log("Skills:", extractedData.skills);
    console.log("Professional Summary:", extractedData.professionalSummary);
    console.log("Parsed Experiences:", extractedData.experiences);
    console.log("--------------------------");

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
  