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

  const { jobTitle, jobDescription, skills, employmentHistory, additionalDetails, mode, conversationHistory } = req.body;

  if (!jobTitle || !mode) {
    return res.status(400).json({ message: 'Job title and mode are required.' });
  }

  let prompt = '';

  if (mode === 'chat') {
    const lastUserMsg = conversationHistory && conversationHistory.length > 0
      ? [...conversationHistory].reverse().find((msg: { role: string; parts: string }) => msg.role === 'User')
      : null;

      prompt = `You are an AI interviewer. Conduct a realistic job interview for the following role:
    - Job Title: ${jobTitle}
    - Job Description: ${jobDescription || 'N/A'}
    - Skills: ${skills || 'N/A'}
    - Employment History: ${employmentHistory || 'N/A'}
    - Additional Details: ${additionalDetails || 'N/A'}

    Current conversation history:
    ${conversationHistory.map((msg: { role: string; parts: string }) => `${msg.role}: ${msg.parts}`).join('\n')}

    ${lastUserMsg ? `Evaluate the last answer for relevance, correctness, and depth. Give feedback (e.g., was it detailed, did it address the question, was it correct?). If the answer is empty, irrelevant, or not meaningful, explain why and suggest how to improve. Avoid using 'N/A' and always provide constructive feedback. Then, ask the next interview question directly, as a human interviewer would. Do not refer to the candidate in your questions.` : 'Ask the first interview question directly, as a human interviewer would. Do not refer to the candidate in your questions.'}`;
  } else if (mode === 'quiz') {
    prompt = `You are an AI quiz master. Generate a multiple-choice quiz question for the following job role. Provide 4 options (A, B, C, D)
    - Job Title: ${jobTitle}
    - Job Description: ${jobDescription || 'N/A'}
    - Skills: ${skills || 'N/A'}
    - Employment History: ${employmentHistory || 'N/A'}
    - Additional Details: ${additionalDetails || 'N/A'}

    The quiz will consist of 10 questions.
    Do not repeat any question that has already been asked in this session.
    `;

    if (conversationHistory && conversationHistory.length > 0) {
      // If there's a conversation history, it means a question was asked and an answer was given
      const lastAIMessage = conversationHistory.findLast((msg: { role: string; parts: string }) => msg.role === 'AI');
      const lastUserMessage = conversationHistory.findLast((msg: { role: string; parts: string }) => msg.role === 'User');

      if (lastAIMessage && lastUserMessage) {
        prompt += `Previous Question: ${lastAIMessage.parts}\n`;
        prompt += `Answer: ${lastUserMessage.parts}\n\n`;
        prompt += `Evaluate the answer to the previous question. Then, generate the next multiple-choice quiz question. Do not refer to the candidate in your questions. Do not repeat any previous questions.`;
      } else {
        prompt += `Generate the first multiple-choice quiz question. Do not refer to the candidate in your questions. Do not repeat any previous questions.`;
      }
    } else {
      prompt += `Generate the first multiple-choice quiz question. Do not refer to the candidate in your questions. Do not repeat any previous questions.`;
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
