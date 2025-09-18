
import React, { useState } from 'react';
import { ArrowLeft, Loader2, Plus } from 'lucide-react';
import { toast } from 'react-toastify';

interface User {
  id: string;
  name: string | null;
  practiceProfile: {
    jobTitle: string | null;
    jobDescription: string | null;
    employmentHistory: string | null;
    skills: string | null;
    additionalDetails: string | null;
  } | null;
}

interface SidebarProps {
  setShowSidebar: React.Dispatch<React.SetStateAction<boolean>>;
  user: User;
  onShowPricingModal: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ setShowSidebar, user, onShowPricingModal }) => {
  const [jobTitle, setJobTitle] = useState(user.practiceProfile?.jobTitle || "");
  const [jobDescription, setJobDescription] = useState(user.practiceProfile?.jobDescription || "");
  const [name, setName] = useState(user.name || "");
  const [employmentHistory, setEmploymentHistory] = useState(user.practiceProfile?.employmentHistory || "");
  const [skills, setSkills] = useState(user.practiceProfile?.skills || "");
  const [additionalDetails, setAdditionalDetails] = useState(user.practiceProfile?.additionalDetails || "");
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdateDetails = async () => {
    setIsUpdating(true);
    try {
      const response = await fetch('/api/onboarding', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          name,
          jobTitle,
          jobDescription,
          employmentHistory,
          skills,
          additionalDetails,
        }),
      });
      if (response.ok) {
        toast.success('Details updated successfully!');
      } else {
        toast.error('Failed to update details.');
      }
    } catch {
      toast.error('Network error.');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="bg-gray-900/50 backdrop-blur-md p-6 rounded-2xl flex-shrink-0 w-full lg:w-96 space-y-8 h-full overflow-y-auto border border-gray-800 sidebar-scrollbar">
      <div className="lg:hidden flex justify-end mb-4">
        <button onClick={() => setShowSidebar(false)} className="p-2 rounded-full hover:bg-gray-800 transition-colors duration-200">
          <ArrowLeft size={24} />
        </button>
      </div>
      {/* Job Details Section */}
      <div className="space-y-4">
        <div>
          <label className="text-gray-400 text-sm mb-1 block">Job title</label>
          <input
            type="text"
            className="w-full py-2 px-3 bg-gray-800 rounded-lg text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
          />
        </div>
        <div>
          <label className="text-gray-400 text-sm mb-1 block">Job description</label>
          <textarea
            className="w-full py-2 px-3 bg-gray-800 rounded-lg text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent h-24"
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
          ></textarea>
        </div>
      </div>
      {/* Personal Details Section */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Personal details</h2>
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-gray-400 text-sm mb-1 block">Name</label>
            <input
              type="text"
              className="w-full py-2 px-3 bg-gray-800 rounded-lg text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              placeholder="Input your name here"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <label className="text-gray-400 text-sm mb-1 block">Employment history</label>
            <input
              type="text"
              className="w-full py-2 px-3 bg-gray-800 rounded-lg text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              placeholder="Input your employment history here"
              value={employmentHistory}
              onChange={(e) => setEmploymentHistory(e.target.value)}
            />
          </div>
          <div>
            <label className="text-gray-400 text-sm mb-1 block">Skills</label>
            <input
              type="text"
              className="w-full py-2 px-3 bg-gray-800 rounded-lg text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              placeholder="Input your skills here"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
            />
          </div>
          <div>
            <label className="text-gray-400 text-sm mb-1 block">Additional candidate details</label>
            <input
              type="text"
              className="w-full py-2 px-3 bg-gray-800 rounded-lg text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              placeholder="Input any additional details here"
              value={additionalDetails}
              onChange={(e) => setAdditionalDetails(e.target.value)}
            />
          </div>
          <button
            className={`w-full mt-2 p-2 rounded-full bg-blue-600 hover:bg-blue-500 font-semibold text-white transition-colors duration-200 cursor-pointer flex items-center justify-center`}
            onClick={handleUpdateDetails}
            disabled={isUpdating}
          >
            {isUpdating ? <Loader2 className="animate-spin" size={20} /> : 'Update Details'}
          </button>
        </div>
      </div>
      {/* Interview Settings Section */}
      <div className="pt-4">
        <h2 className="text-xl font-semibold mb-4">Interview settings</h2>
        <button
          className="w-full p-3 rounded-full bg-blue-600 hover:bg-blue-500 font-semibold text-white transition-colors duration-200"
          onClick={onShowPricingModal}
        >
          <span className="flex justify-center items-center">
            <Plus size={20} className="mr-2" /> Get unlimited interviews
          </span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
