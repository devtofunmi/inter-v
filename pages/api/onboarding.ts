import { NextApiRequest, NextApiResponse } from 'next';
import { unstable_getServerSession } from 'next-auth/next';
import { authOptions } from './auth/[...nextauth]';
import { prisma } from '../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const session = await unstable_getServerSession(req, res, authOptions);
  console.log('Session in /api/onboarding:', session);

  if (!session) {
    return res.status(401).json({ message: 'You must be logged in.' });
  }

  const { jobTitle, professionalSummary, name, employmentHistory, skills, additionalDetails } = req.body;

  const processedEmploymentHistory = JSON.stringify(employmentHistory.filter((item: {role: string}) => item.role.trim() !== ''));

  try {
    const user = await prisma.user.findUnique({
      where: { email: session.user?.email as string },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await prisma.practiceProfile.upsert({
      where: { userId: user.id },
      update: {
        jobTitle,
        professionalSummary,
        employmentHistory: processedEmploymentHistory,
        skills,
        additionalDetails,
      },
      create: {
        userId: user.id,
        jobTitle,
        professionalSummary,
        employmentHistory: processedEmploymentHistory,
        skills,
        additionalDetails,
      },
    });

    await prisma.user.update({
      where: { id: user.id },
      data: {
        name,
        onboardingCompleted: true,
      },
    });

    res.status(200).json({ message: 'Onboarding complete' });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e) {
    res.status(500).json({ message: 'Something went wrong' });
  }
}
