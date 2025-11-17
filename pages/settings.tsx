import Head from "next/head";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Loader2 } from 'lucide-react';
import { useSession } from 'next-auth/react';
import useSWR from 'swr';
import Layout from '../components/dashboard/Layout';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const SettingsPage = () => {
  const { status } = useSession();
  const { data, error, mutate } = useSWR(status === 'authenticated' ? '/api/user' : null, fetcher);
  const router = useRouter();

  const [name, setName] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [professionalSummary, setProfessionalSummary] = useState("");
  const [employmentHistory, setEmploymentHistory] = useState<Array<{ role: string; startDate: string; endDate: string }>>([]);
  const [skills, setSkills] = useState("");
  const [additionalDetails, setAdditionalDetails] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/login');
    }
    if (data && data.user) {
      setName(data.user.name || "");
      setJobTitle(data.user.practiceProfile?.jobTitle || "");
      setProfessionalSummary(data.user.practiceProfile?.professionalSummary || "");
      const eh = data.user.practiceProfile?.employmentHistory;
      if (eh) {
        try {
          const parsed = JSON.parse(eh);
          setEmploymentHistory(parsed);
        } catch (e) {
          setEmploymentHistory([]); // Fallback for malformed JSON
        }
      } else {
        setEmploymentHistory([]);
      }
      setSkills(data.user.practiceProfile?.skills || "");
      setAdditionalDetails(data.user.practiceProfile?.additionalDetails || "");
    }
  }, [status, router, data]);

  const handleHistoryChange = (index: number, field: 'role' | 'startDate' | 'endDate', value: string) => {
    const newHistory = [...employmentHistory];
    newHistory[index] = { ...newHistory[index], [field]: value };
    setEmploymentHistory(newHistory);
  };

  const addHistoryItem = () => {
    setEmploymentHistory([...employmentHistory, { role: '', startDate: '', endDate: '' }]);
  };

  const removeHistoryItem = (index: number) => {
    const newHistory = employmentHistory.filter((_, i) => i !== index);
    setEmploymentHistory(newHistory);
  };

  const handleUpdateDetails = async () => {
    setIsUpdating(true);
    try {
      const response = await fetch('/api/onboarding', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: data.user.id,
          name,
          jobTitle,
          professionalSummary,
          employmentHistory: JSON.stringify(employmentHistory),
          skills,
          additionalDetails,
        }),
      });
      if (response.ok) {
        toast.success('Details updated successfully!');
        mutate(); // Re-fetch user data
      } else {
        toast.error('Failed to update details.');
      }
    } catch {
      toast.error('Network error.');
    } finally {
      setIsUpdating(false);
    }
  };

  if (status === 'loading' || (status === 'authenticated' && !data)) {
    return (
      <Layout title="Settings">
        <div className="flex justify-center items-center min-h-screen">
          <Loader2 className="animate-spin h-10 w-10 text-blue-400" />
        </div>
      </Layout>
    );
  }

  if (error) {
    return <Layout title="Settings"><div>Error loading data</div></Layout>;
  }

  return (
    <Layout title="Settings">
      <Head>
        <title>Settings - Prepkitty</title>
      </Head>
      <ToastContainer />
      <div className="p-6">
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl  border border-gray-200">
          
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">Personal Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-gray-600 text-sm font-medium mb-1 block">Name</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 rounded-full bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-center text-gray-800"
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">Practice Profile</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-gray-600 text-sm font-medium mb-1 block">Target Job Title</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 rounded-full bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-center text-gray-800"
                    placeholder="e.g., Software Engineer"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-gray-600 text-sm font-medium mb-1 block">Key Skills</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 rounded-full bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-center text-gray-800"
                    placeholder="e.g., React, Node.js, Python"
                    value={skills}
                    onChange={(e) => setSkills(e.target.value)}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="text-gray-600 text-sm font-medium mb-1 block">Summary/Job Description</label>
                  <textarea
                    className="w-full px-3 py-2 text-gray-800 rounded-2xl bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-center text-gray-800 h-24"
                    placeholder="Paste the job description here..."
                    value={professionalSummary}
                    onChange={(e) => setProfessionalSummary(e.target.value)}
                  ></textarea>
                </div>
                <div className="md:col-span-2">
                  <label className="text-gray-600 text-sm font-medium mb-1 block">Your Employment History</label>
                  <div className="space-y-4">
                    {employmentHistory.map((job, index) => (
                      <div key={index} className="p-4 border rounded-lg bg-gray-50 space-y-3">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="sm:col-span-2">
                            <label className="text-gray-600 text-xs font-medium">Role</label>
                            <input
                              type="text"
                              placeholder="e.g., Software Engineer"
                              value={job.role}
                              onChange={(e) => handleHistoryChange(index, 'role', e.target.value)}
                              className="w-full rounded-2xl mt-1 text-gray-800 px-3 py-2  bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
                            />
                          </div>
                          <div>
                            <label className="text-gray-600 text-xs font-medium">Start Date</label>
                            <input
                              type="text"
                              placeholder="e.g., Jan 2022"
                              value={job.startDate}
                              onChange={(e) => handleHistoryChange(index, 'startDate', e.target.value)}
                              className="w-full rounded-2xl text-gray-800 mt-1 px-3 py-2  bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
                            />
                          </div>
                          <div>
                            <label className="text-gray-600 text-xs font-medium">End Date</label>
                            <input
                              type="text"
                              placeholder="e.g., Present"
                              value={job.endDate}
                              onChange={(e) => handleHistoryChange(index, 'endDate', e.target.value)}
                              className="w-full rounded-2xl text-gray-800 mt-1 px-3 py-2  bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
                            />
                          </div>
                        </div>
                        <div className="text-right">
                          <button
                            type="button"
                            onClick={() => removeHistoryItem(index)}
                            className="text-red-500 hover:text-red-700 text-sm font-medium"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addHistoryItem}
                      className="mt-2 px-4 py-2 text-blue-400 cursor-pointer text-sm"
                    >
                      + Add Employment
                    </button>
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className="text-gray-600 text-sm font-medium mb-1 block">Additional Details for the Interviewer</label>
                  <textarea
                    className="w-full px-3 py-2 rounded-2xl bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-center text-gray-800 h-24"
                    placeholder="Anything else the AI should know? e.g., focus on behavioral questions."
                    value={additionalDetails}
                    onChange={(e) => setAdditionalDetails(e.target.value)}
                  ></textarea>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button
                className={`px-6 py-2.5 rounded-full bg-blue-400 hover:bg-blue-500 font-semibold text-white transition-colors duration-200 flex items-center justify-center disabled:opacity-50`}
                onClick={handleUpdateDetails}
                disabled={isUpdating}
              >
                {isUpdating ? <Loader2 className="animate-spin" size={20} /> : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SettingsPage;