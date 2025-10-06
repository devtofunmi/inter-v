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
      <div className="flex justify-center items-center min-h-screen font-geist bg-white text-gray-900">
        <Loader2 className="animate-spin h-10 w-10 text-green-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center font-geist bg-white text-gray-900 p-4">
      <Head>
        <title>Onboarding - Inter-V</title>
      </Head>

      <div className="w-full max-w-[400px] ">
        <h2 className="text-3xl font-bold text-center mb-6">Tell Us About Yourself</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              id="name"
              name="name"
              className="w-full px-3 py-2 rounded-full bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 text-center"
              placeholder="Your Name"
              value={onboardingData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <input
              type="text"
              id="jobTitle"
              name="jobTitle"
              className="w-full px-3 py-2 rounded-full bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 text-center"
              placeholder="Job Title"
              value={onboardingData.jobTitle}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <textarea
              id="jobDescription"
              name="jobDescription"
              rows={3}
              className="w-full px-3 py-2 rounded-2xl bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 text-center"
              placeholder="Job Description"
              value={onboardingData.jobDescription}
              onChange={handleChange}
              required
            ></textarea>
          </div>
          <div>
            <input
              type="text"
              id="employmentHistory"
              name="employmentHistory"
              className="w-full px-3 py-2 rounded-full bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 text-center"
              placeholder="Employment History"
              value={onboardingData.employmentHistory}
              onChange={handleChange}
            />
          </div>
          <div>
            <input
              type="text"
              id="skills"
              name="skills"
              className="w-full px-3 py-2 rounded-full bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 text-center"
              placeholder="Skills (comma separated)"
              value={onboardingData.skills}
              onChange={handleChange}
            />
          </div>
          <div>
            <textarea
              id="additionalDetails"
              name="additionalDetails"
              rows={3}
              className="w-full px-3 py-2 rounded-2xl bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 text-center"
              placeholder="Additional Details"
              value={onboardingData.additionalDetails}
              onChange={handleChange}
            ></textarea>
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full cursor-pointer px-4 py-2 rounded-full bg-green-600 hover:bg-green-500 font-bold text-white shadow-lg transition-colors text-lg disabled:opacity-50 disabled:pointer-events-none"
          >
            {isLoading ? <Loader2 className="animate-spin mx-auto" /> : 'Save and Continue'}
          </button>
        </form>
      </div>
    </div>
  );
}