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
  professionalSummary: string;
  name: string;
  employmentHistory: { role: string; startDate: string; endDate: string }[];
  skills: string;
  additionalDetails: string;
  jobField: string;
  subField: string;
}

export default function OnboardingPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({
    jobTitle: '',
    professionalSummary: '',
    name: '',
    employmentHistory: [{ role: '', startDate: '', endDate: '' }],
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      setCvFile(file);
      handleCvUpload(file);
    }
  };

  const handleCvUpload = async (file: File) => {
    setIsUploading(true);
    const formData = new FormData();
    formData.append('cv', file);

    try {
      const response = await fetch('/api/cv-upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        
        const employmentHistory = data.experiences?.map((exp: { jobTitle: string; startDate: string; endDate: string; }) => ({
            role: exp.jobTitle,
            startDate: exp.startDate,
            endDate: exp.endDate,
        }));

        let jobField = '';
        let subField = '';
        let jobTitle = '';

        if (data.experiences && data.experiences.length > 0) {
            const mostRecentExperience = data.experiences[0];
            jobTitle = mostRecentExperience.jobTitle;
            const category = mostRecentExperience.jobCategory;

            const mainFieldMatch = jobFields.find(f => f.label.toLowerCase() === category.toLowerCase());
            if (mainFieldMatch) {
                jobField = mainFieldMatch.value;
            } else {
                for (const mainField of jobFields) {
                    if (mainField.subfields) {
                        const subFieldMatch = mainField.subfields.find(sf => sf.label.toLowerCase() === category.toLowerCase());
                        if (subFieldMatch) {
                            jobField = mainField.value;
                            subField = subFieldMatch.value;
                            break;
                        }
                    }
                }
            }
            if (!jobField && jobTitle) {
                jobField = 'other';
            }
        }

        setOnboardingData(prevData => ({
            ...prevData,
            name: data.name || prevData.name,
            professionalSummary: data.professionalSummary || prevData.professionalSummary,
            skills: data.skills || prevData.skills,
            employmentHistory: employmentHistory && employmentHistory.length > 0 ? employmentHistory : prevData.employmentHistory,
            jobField: jobField || prevData.jobField,
            subField: subField || prevData.subField,
            jobTitle: jobTitle || prevData.jobTitle,
        }));

        toast.success('CV data extracted successfully!');
      } else {
        toast.error('Failed to extract data from CV.');
      }
    } catch (error) {
      console.error('CV upload error:', error);
      toast.error('An error occurred while uploading the CV.');
    }
    setIsUploading(false);
  };

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

  const handleEmploymentHistoryChange = (index: number, field: string, value: string) => {
    const newEmploymentHistory = [...onboardingData.employmentHistory];
    newEmploymentHistory[index] = { ...newEmploymentHistory[index], [field]: value };
    setOnboardingData(prevData => ({ ...prevData, employmentHistory: newEmploymentHistory }));
  };

  const addEmploymentField = () => {
    if (onboardingData.employmentHistory.length < 3) {
      setOnboardingData(prevData => ({ ...prevData, employmentHistory: [...prevData.employmentHistory, { role: '', startDate: '', endDate: '' }] }));
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
      // console.log('Submitting onboarding data:', onboardingData);
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
        <title>Onboarding - Prepkitty</title>
      </Head>

      <div className="w-full max-w-[400px] ">
        <h2 className="text-3xl font-bold text-center mb-6">Tell Us About Yourself</h2>
        <div className="text-center mb-4">
          <p className="text-gray-600">First, upload your CV to get started faster.</p>
        </div>
        <div className="mb-4">
          <label htmlFor="cv-upload" className="w-full cursor-pointer border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center hover:border-blue-400 transition-colors">
            <input id="cv-upload" type="file" className="hidden" onChange={handleFileChange} accept=".pdf,.docx" />
            {isUploading ? (
              <Loader2 className="animate-spin h-8 w-8 text-blue-400" />
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <span className="text-gray-600">{cvFile ? cvFile.name : 'Upload your CV (.pdf, .docx)'}</span>
              </>
            )}
          </label>
          <p className="text-xs text-gray-500 text-center mt-2">Your data is securely encrypted and will only be used to pre-fill this form.</p>
        </div>
        <div className="flex items-center my-4">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="flex-shrink mx-4 text-gray-500">Or fill it manually</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>
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
              id="professionalSummary"
              name="professionalSummary"
              rows={3}
              className="w-full px-3 py-2 rounded-2xl bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-center"
              placeholder="Professional Summary (e.g., 'Results-driven software engineer with 5+ years of experience...')"
              value={onboardingData.professionalSummary}
              onChange={handleChange}
              required
            ></textarea>
          </div>
          <div>
            {onboardingData.employmentHistory.map((history, index) => (
              <div key={index} className="flex flex-col items-center space-y-2 mb-2 p-4 rounded-2xl bg-gray-50 border border-gray-200">
                <input
                  type="text"
                  className="w-full px-3 py-2 rounded-full bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-center"
                  placeholder="Job Title"
                  value={history.role}
                  onChange={(e) => handleEmploymentHistoryChange(index, 'role', e.target.value)}
                />
                <div className="flex w-full space-x-2">
                  <input
                    type="text"
                    onFocus={(e) => (e.target.type = 'date')}
                    onBlur={(e) => (e.target.type = 'text')}
                    className="w-1/2 px-3 py-2 rounded-full bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-center"
                    placeholder="Start Date"
                    value={history.startDate}
                    onChange={(e) => handleEmploymentHistoryChange(index, 'startDate', e.target.value)}
                  />
                  <input
                    type="text"
                    onFocus={(e) => (e.target.type = 'date')}
                    onBlur={(e) => (e.target.type = 'text')}
                    className="w-1/2 px-3 py-2 rounded-full bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-center"
                    placeholder="End Date"
                    value={history.endDate}
                    onChange={(e) => handleEmploymentHistoryChange(index, 'endDate', e.target.value)}
                  />
                </div>
                {onboardingData.employmentHistory.length > 1 && (
                  <button type="button" onClick={() => removeEmploymentField(index)} className="text-red-500 mt-1">Remove</button>
                )}
              </div>
            ))}
            <div className='flex justify-center'>
            {onboardingData.employmentHistory.length < 3 && (
              <button type="button" onClick={addEmploymentField} className="text-blue-500 cursor-pointer">+ Add Employment</button>
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
              placeholder="Briefly introduce yourself, your career goals, and what you're looking for in your next role."
              value={onboardingData.additionalDetails}
              onChange={handleChange}
              required
            ></textarea>
          </div>
          <p className="text-xs text-gray-500 text-center mt-2">
            Your data is securely encrypted and will only be used to personalize your interview experience.
          </p>
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