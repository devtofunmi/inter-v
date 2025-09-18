import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextApiRequest, NextApiResponse } from 'next';

const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
  console.error('GEMINI_API_KEY is not set in the environment variables.');
  // In a real application, you might want to return a 500 error here
}

const genAI = new GoogleGenerativeAI(API_KEY as string);
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { jobTitle, jobDescription, skills, employmentHistory, additionalDetails, mode, conversationHistory, difficulty } = req.body;

  if (!jobTitle || !mode) {
    return res.status(400).json({ message: 'Job title and mode are required.' });
  }

  let prompt = '';

  if (mode === 'chat') {
    const lastUserMsg = conversationHistory && conversationHistory.length > 0
      ? [...conversationHistory].reverse().find((msg: { role: string; parts: string }) => msg.role === 'User')
      : null;

      prompt = `You are an AI interviewer. Your goal is to conduct a realistic job interview.\n    The candidate's details are:\n    - Job Title: ${jobTitle}\n    - Job Description: ${jobDescription || 'N/A'}\n    - Skills: ${skills || 'N/A'}\n    - Employment History: ${employmentHistory || 'N/A'}\n    - Additional Details: ${additionalDetails || 'N/A'}\n\n    The interview difficulty is set to: ${difficulty}.\n\n    Current conversation history:\n    ${conversationHistory.map((msg: { role: string; parts: string }) => `${msg.role}: ${msg.parts}`).join('\n')}\n\n    ${lastUserMsg ? `First, evaluate the candidate's last answer for relevance, correctness, and depth. Give feedback (e.g., was it detailed, did it address the question, was it correct?). If the answer is empty, irrelevant, or not meaningful, explain why and suggest how to improve. Avoid using 'N/A' and always provide constructive feedback. Then, ask the next interview question.` : 'Ask the first interview question. Keep your questions concise and relevant to the candidate\'s profile and the job.'}`;
  } else if (mode === 'quiz') {
    prompt = `You are an AI quiz master. Generate a multiple-choice quiz question based on the following candidate and job details. Provide 4 options (A, B, C, D) and indicate the correct answer.\n    Candidate's details:\n    - Job Title: ${jobTitle}\n    - Job Description: ${jobDescription || 'N/A'}\n    - Skills: ${skills || 'N/A'}\n    - Employment History: ${employmentHistory || 'N/A'}\n    - Additional Details: ${additionalDetails || 'N/A'}\n\n    The quiz difficulty is set to: ${difficulty}. The quiz will consist of 10 questions.

    `;

    if (conversationHistory && conversationHistory.length > 0) {
      // If there's a conversation history, it means a question was asked and an answer was given
      const lastAIMessage = conversationHistory.findLast((msg: { role: string; parts: string }) => msg.role === 'AI');
      const lastUserMessage = conversationHistory.findLast((msg: { role: string; parts: string }) => msg.role === 'User');

      if (lastAIMessage && lastUserMessage) {
        prompt += `Previous Question: ${lastAIMessage.parts}\n`;
        prompt += `Candidate's Answer: ${lastUserMessage.parts}\n\n`;
        prompt += `Evaluate the candidate's answer to the previous question. Then, generate the next multiple-choice quiz question.`;
      } else {
        prompt += `Generate the first multiple-choice quiz question.`;
      }
    } else {
      prompt += `Generate the first multiple-choice quiz question.`;
    }

  prompt += `\n\nIMPORTANT: Do not use asterisks, bold, or markdown formatting for section headers. Just use plain text.\nFormat your response as follows:\n    Question: [Your question here]\n    A) [Option A]\n    B) [Option B]\n    C) [Option C]\n    D) [Option D]\n    Answer: [Correct Option Letter (e.g., A)]\n    Next Question: [Your next question here]`;

  } else {
    return res.status(400).json({ message: 'Invalid mode specified.' });
  }

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    console.log('Raw Gemini API response (quiz mode):', text);
    res.status(200).json({ response: text });
  } catch (error) {
    console.error('Error calling Gemini API:', JSON.stringify(error, null, 2));
    res.status(500).json({ message: 'Error generating content from AI.' });
  }
}
