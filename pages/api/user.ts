import { NextApiRequest, NextApiResponse } from 'next';
import { unstable_getServerSession } from 'next-auth/next';
import { authOptions } from './auth/[...nextauth]';
import { prisma } from '../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const session = await unstable_getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ message: 'You must be logged in.' });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: session.user?.email as string },
      include: {
        practiceProfile: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ user });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e) {
    res.status(500).json({ message: 'Something went wrong' });
  }
}
