import { NextApiRequest, NextApiResponse } from 'next';
import { unstable_getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import { prisma } from '../../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const session = await unstable_getServerSession(req, res, authOptions);

  if (!session || !session.user) {
    return res.status(401).json({ message: 'You must be logged in.' });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email as string },
      include: { practiceProfile: true },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // If there's no practice profile, we can't generate a CV
    if (!user.practiceProfile) {
      // We'll create an empty practice profile to avoid errors
      await prisma.practiceProfile.create({
        data: {
          userId: user.id,
          jobTitle: '',
          professionalSummary: '',
          employmentHistory: '[]',
          skills: '',
          additionalDetails: '',
        },
      });
    }
    
    // Re-fetch user with practice profile
    const updatedUser = await prisma.user.findUnique({
        where: { email: session.user.email as string },
        include: { practiceProfile: true },
    });


    res.status(200).json({ message: 'CV generation initiated.', user: updatedUser });

  } catch (error) {
    console.error('CV generation error:', error);
    res.status(500).json({ message: 'Error generating CV' });
  }
}
