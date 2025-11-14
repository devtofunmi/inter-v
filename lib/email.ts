import nodemailer from 'nodemailer';

export const sendVerificationEmail = async (email: string, token: string) => {
  const verificationUrl = `${process.env.NEXTAUTH_URL}/api/auth/verify-email?token=${token}`;

  // Always send real email in ALL environments
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASS, 
    },
  });

  try {
    await transporter.sendMail({
      from: `"PrepKitty" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: 'Verify your email address',
      html: `
        <p>Welcome to PrepKitty!</p>
        <p>Please click the link below to verify your email address:</p>
        <a href="${verificationUrl}">${verificationUrl}</a>
      `,
    });

    console.log(`📧 Verification email sent to: ${email}`);
  } catch (error) {
    console.error('❌ EMAIL ERROR:', error);
    throw new Error('Failed to send verification email');
  }
};