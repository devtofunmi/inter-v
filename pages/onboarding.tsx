import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { useSession } from 'next-auth/react';
import { Loader2 } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import CustomSelect from '../components/dashboard/practice/CustomSelect';

interface SubField {
  value: string;
  label: string;
}

const jobFields: { value: string; label: string; subfields?: SubField[] }[] = [
  { value: 'engineering', label: 'Engineering', subfields: [
    { value: 'software', label: 'Software' },
    { value: 'mechanical', label: 'Mechanical' },
    { value: 'electrical', label: 'Electrical' },
    { value: 'civil', label: 'Civil' },
    { value: 'chemical', label: 'Chemical' },
  ] },
  { value: 'marketing', label: 'Marketing' },
  { value: 'sales', label: 'Sales' },
  { value: 'product', label: 'Product' },
  { value: 'design', label: 'Design' },
  { value: 'finance', label: 'Finance' },
  { value: 'hr', label: 'Human Resources' },
  { value: 'other', label: 'Other' },
];

interface OnboardingData {
  jobTitle: string;
  jobDescription: string;
  name: string;
  employmentHistory: string[];
  skills: string;
  additionalDetails: string;
  jobField: string;
  subField: string;
}

export default function OnboardingPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({
    jobTitle: '',
    jobDescription: '',
    name: '',
    employmentHistory: [''],
    skills: '',
    additionalDetails: '',
    jobField: '',
    subField: '',
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated' && !onboardingData.name) {
      setOnboardingData(prevData => ({ ...prevData, name: session.user?.name || '' }));
    }
  }, [status, router, session, onboardingData.name]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setOnboardingData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleJobFieldChange = (value: string) => {
    const selectedField = jobFields.find(field => field.value === value);
    const jobTitle = selectedField && !selectedField.subfields ? selectedField.label : '';
    setOnboardingData(prevData => ({
      ...prevData,
      jobField: value,
      subField: '',
      jobTitle: value === 'other' ? '' : jobTitle,
    }));
  };

  const handleSubFieldChange = (value: string) => {
    const selectedField = jobFields.find(field => field.value === onboardingData.jobField);
    const selectedSubField = selectedField?.subfields?.find(sf => sf.value === value);
    const jobTitle = selectedField && selectedSubField ? `${selectedSubField.label} ${selectedField.label}` : '';
    setOnboardingData(prevData => ({
      ...prevData,
      subField: value,
      jobTitle,
    }));
  };

  const handleEmploymentHistoryChange = (index: number, value: string) => {
    const newEmploymentHistory = [...onboardingData.employmentHistory];
    newEmploymentHistory[index] = value;
    setOnboardingData(prevData => ({ ...prevData, employmentHistory: newEmploymentHistory }));
  };

  const addEmploymentField = () => {
    if (onboardingData.employmentHistory.length < 3) {
      setOnboardingData(prevData => ({ ...prevData, employmentHistory: [...prevData.employmentHistory, ''] }));
    }
  };

  const removeEmploymentField = (index: number) => {
    const newEmploymentHistory = [...onboardingData.employmentHistory];
    newEmploymentHistory.splice(index, 1);
    setOnboardingData(prevData => ({ ...prevData, employmentHistory: newEmploymentHistory }));
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
        const errorData = await response.json();
        toast.error(errorData.message || 'Something went wrong. Please try again.');
        console.error('Onboarding error:', errorData);
      }
    } catch (e) {
      console.error('Onboarding error:', e);
      toast.error('An unexpected error occurred. Please try again later.');
    }
    setIsLoading(false);
  };

  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center min-h-screen font-geist bg-white text-gray-900">
        <Loader2 className="animate-spin h-10 w-10 text-blue-400" />
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
              className="w-full px-3 py-2 rounded-full bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-center"
              placeholder="Your Name"
              value={onboardingData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <CustomSelect
              options={jobFields.map(field => ({ value: field.value, label: field.label }))}
              value={onboardingData.jobField}
              onChange={handleJobFieldChange}
              placeholder="Select a Job category"
            />
          </div>
          {onboardingData.jobField === 'engineering' && (
            <div>
              <CustomSelect
                options={jobFields.find(field => field.value === 'engineering')?.subfields || []}
                value={onboardingData.subField}
                onChange={handleSubFieldChange}
                placeholder="Select a Job title"
              />
            </div>
          )}
          {onboardingData.jobField === 'other' && (
            <div>
              <input
                type="text"
                id="jobTitle"
                name="jobTitle"
                className="w-full px-3 py-2 rounded-full bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-center"
                placeholder="Job Title"
                value={onboardingData.jobTitle}
                onChange={handleChange}
                required
              />
            </div>
          )}
          <div>
            <textarea
              id="jobDescription"
              name="jobDescription"
              rows={3}
              className="w-full px-3 py-2 rounded-2xl bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-center"
              placeholder="Job Description"
              value={onboardingData.jobDescription}
              onChange={handleChange}
              required
            ></textarea>
          </div>
          <div>
            {onboardingData.employmentHistory.map((history, index) => (
              <div key={index} className="flex flex-col  items-center  space-x-2 mb-2">
                <input
                  type="text"
                  id={`employmentHistory-${index}`}
                  name={`employmentHistory-${index}`}
                  className="w-full px-3 py-2 rounded-full bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-center"
                  placeholder="Employment History"
                  value={history}
                  onChange={(e) => handleEmploymentHistoryChange(index, e.target.value)}
                />
                {onboardingData.employmentHistory.length > 1 && (
                  <button type="button" onClick={() => removeEmploymentField(index)} className="text-red-500 mt-1">Remove</button>
                )}
              </div>
            ))}
            <div className='flex justify-center'>
            {onboardingData.employmentHistory.length < 3 && (
              <button type="button" onClick={addEmploymentField} className="text-blue-500 cursor-pointer">+ Add Role</button>
            )}
           </div>
          </div>
          <div>
            <input
              type="text"
              id="skills"
              name="skills"
              className="w-full px-3 py-2 rounded-full bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-center"
              placeholder="Skills (comma separated)"
              value={onboardingData.skills}
              onChange={handleChange}
            />
          </div>
          <div>
            <textarea
              id="additionalDetails"
              name="additionalDetails"
              rows={5}
              className="w-full px-3 py-2 rounded-2xl bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-center"
              placeholder="Tell me about yourself"
              value={onboardingData.additionalDetails}
              onChange={handleChange}
              required
            ></textarea>
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full cursor-pointer px-4 py-2 rounded-full bg-blue-400 hover:bg-blue-500 font-bold text-white shadow-lg transition-colors text-lg disabled:opacity-50 disabled:pointer-events-none"
          >
            {isLoading ? <Loader2 className="animate-spin mx-auto" /> : 'Save and Continue'}
          </button>
        </form>
      </div>
          <ToastContainer />
    </div>
  );
}