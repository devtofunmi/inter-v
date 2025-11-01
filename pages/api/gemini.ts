import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextApiRequest, NextApiResponse } from 'next';

const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
  console.error('GEMINI_API_KEY is not set in the environment variables.');
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

      prompt = `You are an AI interviewer. Your task is to conduct a highly personalized job interview based on the candidate's specific background and the job they are applying for.

    **Candidate Profile:**
    - Tell me about yourself: ${additionalDetails || 'N/A'}
    - Employment History: ${employmentHistory || 'N/A'}
    - Skills: ${skills || 'N/A'}

    **Job Details:**
    - Job Title: ${jobTitle}
    - Job Description: ${jobDescription || 'N/A'}

    **Instructions:**
    - Use the candidate's profile to ask relevant and specific questions.
    - Do not ask generic questions. Every question should be tailored to the candidate's experience and the job requirements.
    - Refer to specific experiences from their employment history.
    - Ask about the skills they've listed.

    Current conversation history:
    ${conversationHistory.map((msg: { role: string; parts: string }) => `${msg.role}: ${msg.parts}`).join('\n')}

    ${lastUserMsg ? `Evaluate the last answer for relevance, correctness, and depth. Give feedback (e.g., was it detailed, did it address the question, was it correct?). If the answer is empty, irrelevant, or not meaningful, explain why and suggest how to improve. Avoid using 'N/A' and always provide constructive feedback. Then, ask the next interview question directly, as a human interviewer would. Do not refer to the candidate in your questions.` : 'Ask the first interview question directly, as a human interviewer would. Do not refer to the candidate in your questions.'}`;
  } else if (mode === 'quiz') {
    prompt = `You are an AI quiz master. Your task is to generate a multiple-choice quiz question that is highly relevant to the candidate's background and the job they are applying for.

    **Candidate Profile:**
    - Tell me about yourself: ${additionalDetails || 'N/A'}
    - Employment History: ${employmentHistory || 'N/A'}
    - Skills: ${skills || 'N/A'}

    **Job Details:**
    - Job Title: ${jobTitle}
    - Job Description: ${jobDescription || 'N/A'}

    **Instructions:**
    - Use the candidate's profile to create a quiz question that tests their knowledge and skills in the context of the job.
    - The quiz will consist of 10 questions.
    - Do not repeat any question that has already been asked in this session. The user will provide the full conversation history; use the AI (role: AI) messages in that history as the list of previously asked questions and avoid repeating them.
    `;

    if (conversationHistory && conversationHistory.length > 0) {
      // If there's a conversation history, send the previous AI lines explicitly so the model can compare
      const previousAIQuestions = conversationHistory
        .filter((msg: { role: string; parts: string }) => msg.role === 'AI')
        .map((msg: { role: string; parts: string }) => `- ${msg.parts.trim()}`)
        .join('\n');

      if (previousAIQuestions) {
        prompt += `\nPreviously asked questions in this session:\n${previousAIQuestions}\n`;
      }

      prompt += `\nGenerate the next multiple-choice quiz question. Do not refer to the candidate in your questions. Do not repeat any previous questions.`;
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
