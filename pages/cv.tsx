import { useState, useEffect } from 'react';
import { getSession } from 'next-auth/react';
import { prisma } from '@/lib/prisma';
import type { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import Layout from '../components/dashboard/Layout';
import { CVTemplate } from '../components/dashboard/CVTemplate';
import { Loader2, Download, Edit, Save, PlusCircle } from 'lucide-react';
import { useRouter } from 'next/router';

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
};

type CVPageProps = {
  cv: ({ id: string } & CVData) | null;
};

export default function CVPage({ cv: initialCv }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [cv, setCv] = useState(initialCv);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const router = useRouter();

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

  const handleDownload = () => {
    window.location.href = '/api/generate-cv';
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
        throw new Error('Failed to save CV');
      }
      setIsEditing(false);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDataChange = (newData: CVData) => {
    setCv(prev => (prev ? { ...prev, ...newData } : null));
  };

  if (!cv) {
    return (
      <Layout>
        <div className="p-6 text-center">
          <h1 className="text-3xl font-bold mb-4 text-black">Your CV</h1>
          <p className="mb-4 text-black">You don't have a CV yet. Generate one from your profile to get started.</p>
          <button
            onClick={handleGenerateNewCV}
            className="bg-gray-200 hover:bg-gray-300 text-black font-bold py-2 px-4 rounded-2xl flex items-center mx-auto"
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
        <CVTemplate data={cv} isEditing={isEditing} onDataChange={handleDataChange} />
        <div className="flex justify-center items-center mt-4">
          <div className="flex gap-2">
            {isEditing ? (
              <button
                onClick={handleSave}
                className="bg-blue-400 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded-full cursor-pointer flex items-center"
                disabled={isSaving}
              >
                {isSaving ? <Loader2 className="animate-spin mr-2" /> : <Save className="mr-2" />}
                Save
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
              onClick={handleDownload}
              className="bg-blue-400 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded-full cursor-pointer flex items-center"
            >
              <Download size={20} className="mr-2" />
              Download CV
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const session = await getSession(context);

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
  const { jobTitle, professionalSummary, employmentHistory, skills, additionalDetails } = userWithProfile.practiceProfile;
  const parsedEmploymentHistory = employmentHistory ? JSON.parse(employmentHistory as string) : [];

  const cvData = {
    id: userWithProfile.id, // Using user id as a stand-in for a real CV id
    name: name || '',
    jobTitle: jobTitle || '',
    professionalSummary: professionalSummary || '',
    employmentHistory: parsedEmploymentHistory,
    skills: skills || '',
    additionalDetails: additionalDetails || '',
  };

  return {
    props: {
      cv: JSON.parse(JSON.stringify(cvData)),
    },
  };
};
