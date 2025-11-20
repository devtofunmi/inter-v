import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const session = await getServerSession(req, res, authOptions);

  if (!session || !session.user) {
    return res.status(401).json({ message: 'You must be logged in.' });
  }

  const { id } = req.query;
  const { content } = req.body;

  if (session.user.id !== id) {
    return res.status(403).json({ message: 'You are not authorized to update this profile.' });
  }

  try {
    const { name, ...practiceProfileData } = content;

    await prisma.$transaction(async (prisma) => {
      await prisma.user.update({
        where: { id: id as string },
        data: { name },
      });

      await prisma.practiceProfile.update({
        where: { userId: id as string },
        data: {
          ...practiceProfileData,
          employmentHistory: JSON.stringify(practiceProfileData.employmentHistory || []),
          projects: JSON.stringify(practiceProfileData.projects || []),
        },
      });
    });

    res.status(200).json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ message: 'Error updating profile' });
  }
}
