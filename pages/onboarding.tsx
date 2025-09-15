import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { useSession } from 'next-auth/react';
import { Loader2 } from 'lucide-react';

interface OnboardingData {
  jobTitle: string;
  jobDescription: string;
  name: string;
  employmentHistory: string;
  skills: string;
  additionalDetails: string;
}

export default function OnboardingPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({
    jobTitle: '',
    jobDescription: '',
    name: '',
    employmentHistory: '',
    skills: '',
    additionalDetails: '',
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth');
    } else if (status === 'authenticated' && !onboardingData.name) {
      setOnboardingData(prevData => ({ ...prevData, name: session.user?.name || '' }));
    }
  }, [status, router, session, onboardingData.name]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setOnboardingData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch('/api/onboarding', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(onboardingData),
      });

      if (response.ok) {
        router.push('/dashboard');
      } else {
        // Handle error
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      // Handle error
    }
    setIsLoading(false);
  };

  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="animate-spin h-10 w-10 text-blue-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-950 via-black to-gray-900 text-white p-4">
      <Head>
        <title>Onboarding - Inter-V</title>
      </Head>

      <div className="bg-gray-900 p-8 rounded-lg shadow-lg w-full max-w-md border border-gray-800">
        <h2 className="text-3xl font-bold text-center mb-6">Tell Us About Yourself</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              className="w-full px-3 py-2 rounded-md bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={onboardingData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-300 mb-1">Job Title</label>
            <input
              type="text"
              id="jobTitle"
              name="jobTitle"
              className="w-full px-3 py-2 rounded-md bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={onboardingData.jobTitle}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="jobDescription" className="block text-sm font-medium text-gray-300 mb-1">Job Description</label>
            <textarea
              id="jobDescription"
              name="jobDescription"
              rows={3}
              className="w-full px-3 py-2 rounded-md bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={onboardingData.jobDescription}
              onChange={handleChange}
              required
            ></textarea>
          </div>
          <div>
            <label htmlFor="employmentHistory" className="block text-sm font-medium text-gray-300 mb-1">Employment History</label>
            <input
              type="text"
              id="employmentHistory"
              name="employmentHistory"
              className="w-full px-3 py-2 rounded-md bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={onboardingData.employmentHistory}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="skills" className="block text-sm font-medium text-gray-300 mb-1">Skills</label>
            <input
              type="text"
              id="skills"
              name="skills"
              className="w-full px-3 py-2 rounded-md bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={onboardingData.skills}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="additionalDetails" className="block text-sm font-medium text-gray-300 mb-1">Additional Details</label>
            <textarea
              id="additionalDetails"
              name="additionalDetails"
              rows={3}
              className="w-full px-3 py-2 rounded-md bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={onboardingData.additionalDetails}
              onChange={handleChange}
            ></textarea>
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-500 font-medium disabled:opacity-50"
          >
            {isLoading ? <Loader2 className="animate-spin mx-auto" /> : 'Save and Continue'}
          </button>
        </form>
      </div>
    </div>
  );
}