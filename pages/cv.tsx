import { useState, useEffect, useRef } from 'react';
import { getServerSession } from "next-auth/next";
import { authOptions } from "./api/auth/[...nextauth]";
import { prisma } from '@/lib/prisma';
import type { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import Layout from '../components/dashboard/Layout';
import { CVTemplate } from '../components/dashboard/CVTemplate';
import { Loader2, Download, Edit, PlusCircle } from 'lucide-react';
import { useRouter } from 'next/router';
import html2canvas from "html2canvas";
import jsPDF from "jspdf";


type CVData = {
  name: string;
  jobTitle: string;
  professionalSummary: string;
  employmentHistory: Array<{
    jobTitle: string;
    company: string;
    location: string;
    startDate: string;
    endDate: string;
    description: string;
  }>;
  skills: string;
  additionalDetails: string;
  portfolioLink?: string;
  gmailLink?: string;
  githubLink?: string;
  projects?: Array<{
    projectName: string;
    description: string;
    stacks: string;
    link: string;
  }>;
};



export default function CVPage({ cv: initialCv }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [cv, setCv] = useState(initialCv);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const router = useRouter();
  const cvRef = useRef<HTMLDivElement>(null); 


  const handlePrint = async () => {
    if (!cvRef.current) return;
    setIsDownloading(true);
    const element = cvRef.current;
    const originalHeight = element.style.height;
    element.style.height = `${element.scrollHeight}px`;

    try {
      await new Promise(resolve => setTimeout(resolve, 100));

      window.scrollTo(0, 0);
      const canvas = await html2canvas(element, {
        scale: 3,
        useCORS: true,
        backgroundColor: '#ffffff',
        height: element.scrollHeight,
        windowHeight: element.scrollHeight
      });

      const imgData = canvas.toDataURL('image/jpeg', 1.0);
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const imgProps = pdf.getImageProperties(imgData);
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      let heightLeft = pdfHeight;
      let position = 0;
      const pageHeight = pdf.internal.pageSize.getHeight();

      pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, pdfHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position -= pageHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, pdfHeight);
        heightLeft -= pageHeight;
      }

      const cvRect = element.getBoundingClientRect();

      const ensureHttps = (url: string) => {
        if (!url) return '';
        if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('mailto:')) {
          return url;
        }
        return `https://${url}`;
      }

      const addLink = (elementId: string, url: string) => {
        const linkElement = document.getElementById(elementId);
        if (linkElement) {
          const rect = linkElement.getBoundingClientRect();
          const x = ((rect.left - cvRect.left) / cvRect.width) * pdfWidth;
          const y = ((rect.top - cvRect.top) / cvRect.height) * pdfHeight;
          const w = (rect.width / cvRect.width) * pdfWidth;
          const h = (rect.height / cvRect.height) * pdfHeight;
          pdf.link(x, y, w, h, { url: ensureHttps(url) });
        }
      };

      if (cv.portfolioLink) {
        addLink('portfolio-link', cv.portfolioLink);
      }
      if (cv.gmailLink) {
        addLink('gmail-link', `mailto:${cv.gmailLink}`);
      }
      if (cv.githubLink) {
        addLink('github-link', cv.githubLink);
      }
      cv.projects?.forEach((project: { link: string }, index: number) => {
        if (project.link) {
          addLink(`project-link-${index}`, project.link);
        }
      });

      pdf.save(`${cv.name}_CV.pdf`);
    } catch (error) {
      console.error('PDF ERROR:', error);
    } finally {
      element.style.height = originalHeight;
      setIsDownloading(false);
    }
  };


  useEffect(() => {
    if (!initialCv) {
      setIsEditing(true);
    }
  }, [initialCv]);

  const handleGenerateNewCV = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/cv', { method: 'POST' });
      if (!response.ok) {
        throw new Error('Failed to generate CV');
      }
      router.replace(router.asPath); // Refresh page to get new CV
    } catch (error) {
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };



  const handleSave = async () => {
    if (!cv) return;
    setIsSaving(true);
    try {
      const { id, ...content } = cv;
      const response = await fetch(`/api/cv/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Failed to parse error response' }));
        console.error('Failed to save CV. Status:', response.status, 'Response:', errorData);
        throw new Error(`Failed to save CV. Status: ${response.status}`);
      }
      setIsEditing(false);
    } catch (error) {
      console.error('Error in handleSave:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDataChange = (newData: CVData) => {
    setCv((prev: (CVData & { id: string }) | null) => (prev ? { ...prev, ...newData } : null));
  };

  if (!cv) {
    return (
      <Layout>
        <div className="p-6 flex justify-center flex-col items-center text-center">
          <h1 className="text-3xl font-bold mb-4 text-gray-900">Your CV</h1>
          <p className="mb-4 text-gray-900">You don&apos;t have a CV yet. Generate one from your profile to get started.</p>
          <button
            onClick={handleGenerateNewCV}
            className="bg-blue-400 hover:bg-blue-500 cursor-pointer text-white font-bold py-2 px-4 rounded-full flex items-center mx-auto"
            disabled={isGenerating}
          >
            {isGenerating ? <Loader2 className="animate-spin mr-2" /> : <PlusCircle className="mr-2" />}
            {isGenerating ? 'Generating...' : 'Generate CV from Profile'}
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-6">
        <div ref={cvRef}>
          <CVTemplate data={cv} isEditing={isEditing} onDataChange={handleDataChange} />
        </div>
        <div className="flex justify-center items-center mt-4">
          <div className="flex gap-2">
            {isEditing ? (
              <button
                onClick={handleSave}
                className="bg-blue-400 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded-full cursor-pointer flex items-center"
                disabled={isSaving}
              >
                 {isSaving ? (
                              <Loader2 className="animate-spin mx-auto text-white" />
                            ) : (
                              'Save'
                            )}
              </button>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="bg-blue-400 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded-full cursor-pointer flex items-center"
              >
                <Edit size={20} className="mr-2" />
                Edit
              </button>
            )}
            <button
              onClick={handlePrint}
              className="bg-blue-400 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded-full cursor-pointer flex items-center"
              disabled={isDownloading}
            >
              {isDownloading ? (
                <Loader2 className="animate-spin mr-2" />
              ) : (
                <Download size={20} className="mr-2" />
              )}
              {isDownloading ? '' : 'Download CV'}
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (!session?.user?.id) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  const userWithProfile = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { practiceProfile: true },
  });

  if (!userWithProfile?.practiceProfile) {
    return {
      redirect: {
        destination: '/onboarding',
        permanent: false,
      },
    };
  }
  
  const { name } = userWithProfile;
  const { jobTitle, professionalSummary, employmentHistory, skills, additionalDetails, portfolioLink, gmailLink, githubLink, projects } = userWithProfile.practiceProfile;
  const parsedEmploymentHistory = employmentHistory ? JSON.parse(employmentHistory as string) : [];
  const parsedProjects = projects ? JSON.parse(projects as string) : [];

  const cvData = {
    id: userWithProfile.id, // Using user id as a stand-in for a real CV id
    name: name || '',
    jobTitle: jobTitle || '',
    professionalSummary: professionalSummary || '',
    employmentHistory: parsedEmploymentHistory,
    skills: skills || '',
    additionalDetails: additionalDetails || '',
    portfolioLink: portfolioLink || '',
    gmailLink: gmailLink || '',
    githubLink: githubLink || '',
    projects: parsedProjects,
  };

  return {
    props: {
      cv: JSON.parse(JSON.stringify(cvData)),
    },
  };
};