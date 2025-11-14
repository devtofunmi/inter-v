import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';
import bcrypt from 'bcrypt';
import { sendVerificationEmail } from '../../../lib/email';
import crypto from 'crypto';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

    const token = crypto.randomBytes(32).toString('hex');

    const verificationToken = await prisma.verificationToken.create({
      data: {
        identifier: user.email!,
        token,
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      },
    });

    // send email (REAL or VIRTUAL depending on config)
    await sendVerificationEmail(user.email!, verificationToken.token);

    return res.status(201).json({
      message: 'Signup successful. Please check your email for verification.',
    });
  } catch (error: unknown) {
  console.error(' SIGNUP API ERROR:', error);

  const errMessage =
    error instanceof Error ? error.message : 'Something went wrong';

  return res.status(500).json({
    message: errMessage,
  });
}

}
