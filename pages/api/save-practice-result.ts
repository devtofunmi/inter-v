import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../lib/prisma';
import { unstable_getServerSession } from 'next-auth/next';
import { authOptions } from './auth/[...nextauth]';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const session = await unstable_getServerSession(req, res, authOptions);

  if (!session || !session.user || !session.user.id) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const { mode, difficulty, score, totalQuestions, jobTitle, jobDescription } = req.body;

  if (!mode || !difficulty || score === undefined || totalQuestions === undefined) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const practiceResult = await prisma.practiceResult.create({
      data: {
        userId: session.user.id,
        mode,
        difficulty,
        score,
        totalQuestions,
        jobTitle,
        jobDescription,
      },
    });
    res.status(200).json({ message: 'Practice result saved', practiceResult });
  } catch (error: unknown) {
    console.error('Error saving practice result:', error);
    if (error instanceof Error) {
      res.status(500).json({ message: 'Error saving practice result', error: error.message, stack: error.stack });
    } else {
      res.status(500).json({ message: 'Error saving practice result', error });
    }
  }
}
