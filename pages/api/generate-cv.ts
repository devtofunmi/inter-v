import { NextApiRequest, NextApiResponse } from 'next';
import { unstable_getServerSession } from 'next-auth/next';
import { authOptions } from './auth/[...nextauth]';
import { prisma } from '../../lib/prisma';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { CVTemplate } from '../../components/dashboard/CVTemplate';
import puppeteer from 'puppeteer';

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
      include: { practiceProfile: true },
    });

    if (!user || !user.practiceProfile) {
      return res.status(404).json({ message: 'Practice profile not found.' });
    }

    const { name } = user;
    const { jobTitle, professionalSummary, employmentHistory, skills, additionalDetails } = user.practiceProfile;

    const parsedEmploymentHistory = employmentHistory ? JSON.parse(employmentHistory) : [];

    const cvData = {
      name: name || '',
      jobTitle: jobTitle || '',
      professionalSummary: professionalSummary || '',
      employmentHistory: parsedEmploymentHistory,
      skills: skills || '',
      additionalDetails: additionalDetails || '',
    };

    const cvHtml = ReactDOMServer.renderToString(React.createElement(CVTemplate, cvData));

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(cvHtml, { waitUntil: 'networkidle0' });
    const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });
    await browser.close();

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=cv.pdf');
    res.send(pdfBuffer);

  } catch (error) {
    console.error('CV generation error:', error);
    res.status(500).json({ message: 'Error generating CV' });
  }
}
