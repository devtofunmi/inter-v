import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../lib/prisma';
import { unstable_getServerSession } from 'next-auth/next';
import { authOptions } from './auth/[...nextauth]';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const session = await unstable_getServerSession(req, res, authOptions);

  if (!session || !session.user?.email) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        name: true,
        practiceResults: {
          orderBy: { createdAt: 'desc' },
          take: 10,
          select: {
            id: true,
            mode: true,
            difficulty: true,
            score: true,
            totalQuestions: true,
            jobTitle: true,
            jobDescription: true,
            createdAt: true,
          },
        },
      },
    });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ user });
  } catch {
    res.status(500).json({ message: 'Something went wrong' });
  }
}
