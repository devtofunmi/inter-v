import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { token } = req.query;

  if (!token || typeof token !== 'string') {
    return res.status(400).json({ message: 'Invalid token' });
  }

  try {
    const verificationToken = await prisma.verificationToken.findUnique({
      where: { token },
    });

    if (!verificationToken || verificationToken.expires < new Date()) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    const existingUser = await prisma.user.findUnique({
        where: { email: verificationToken.identifier },
    });

    if (existingUser) {
        if (existingUser.emailVerified) {
            // User is already verified, just redirect to login
            return res.redirect('/login?message=Email already verified');
        }

        await prisma.user.update({
            where: { id: existingUser.id },
            data: { emailVerified: new Date() },
        });
    } else {
        // This case should ideally not happen if the token was generated on signup
        return res.status(404).json({ message: 'User not found' });
    }

    await prisma.verificationToken.delete({
      where: { token },
    });

    // Redirect to a page that will auto-login and then go to onboarding
    res.redirect(`/login?email=${encodeURIComponent(verificationToken.identifier)}&verified=true`);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Something went wrong' });
  }
}
