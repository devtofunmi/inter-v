import React from 'react';

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

type CVTemplateProps = {
  data: CVData;
  isEditing?: boolean;
  onDataChange?: (newData: CVData) => void;
};

export const CVTemplate: React.FC<CVTemplateProps> = ({ data, isEditing = false, onDataChange = () => {} }) => {
  const handleInputChange = (field: keyof CVData, value: CVData[keyof CVData]) => {
    onDataChange({ ...data, [field]: value });
  };

  const handleHistoryChange = (index: number, field: string, value: string) => {
    const newHistory = [...(data.employmentHistory || [])];
    newHistory[index] = { ...newHistory[index], [field]: value };
    handleInputChange('employmentHistory', newHistory);
  };

  const addHistoryEntry = () => {
    const newHistory = [...(data.employmentHistory || []), { jobTitle: '', company: '', location: '', startDate: '', endDate: '', description: '' }];
    handleInputChange('employmentHistory', newHistory);
  };

  const removeHistoryEntry = (index: number) => {
    const newHistory = (data.employmentHistory || []).filter((_, i) => i !== index);
    handleInputChange('employmentHistory', newHistory);
  };

  const handleProjectChange = (index: number, field: string, value: string) => {
    const newProjects = [...(data.projects || [])];
    newProjects[index] = { ...newProjects[index], [field]: value };
    handleInputChange('projects', newProjects);
  };

  const addProjectEntry = () => {
    const newProjects = [...(data.projects || []), { projectName: '', description: '', stacks: '', link: '' }];
    handleInputChange('projects', newProjects);
  };

  const removeProjectEntry = (index: number) => {
    const newProjects = (data.projects || []).filter((_, i) => i !== index);
    handleInputChange('projects', newProjects);
  };

  return (
    <div className="bg-white p-8 text-black rounded-xl border border-gray-200 max-w-4xl mx-auto font-sans">
      {isEditing ? (
        <input
          type="text"
          value={data.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
          className="w-full px-3 py-2 rounded-full bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400  text-2xl font-bold"
        />
      ) : (
        <h1 className="text-2xl font-bold  mb-2">{data.name}</h1>
      )}
      {isEditing ? (
        <input
          type="text"
          value={data.jobTitle}
          onChange={(e) => handleInputChange('jobTitle', e.target.value)}
          className="w-full px-3 py-2 rounded-full bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 mt-2 text-lg"
        />
      ) : (
        <p className="text-lg font-bold text-black mb-2">{data.jobTitle}</p>
      )}

      {isEditing ? (
        <div className="grid grid-cols-3 mt-2 gap-4 mb-8">
          <input type="text" placeholder="Portfolio Link" value={data.portfolioLink || ''} onChange={(e) => handleInputChange('portfolioLink', e.target.value)} className="w-full px-3 py-2 rounded-full bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-center" />
          <input type="text" placeholder="Gmail Link" value={data.gmailLink || ''} onChange={(e) => handleInputChange('gmailLink', e.target.value)} className="w-full px-3 py-2 rounded-full bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-center" />
          <input type="text" placeholder="Github Link" value={data.githubLink || ''} onChange={(e) => handleInputChange('githubLink', e.target.value)} className="w-full px-3 py-2 rounded-full bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-center" />
        </div>
      ) : (
        <div className="flex space-x-4 mb-8">
          {data.portfolioLink && <a href={data.portfolioLink.startsWith('http') ? data.portfolioLink : `https://${data.portfolioLink}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Portfolio</a>}
          {data.gmailLink && <a href={`mailto:${data.gmailLink}`} className="text-blue-500 hover:underline">Email</a>}
          {data.githubLink && <a href={data.githubLink.startsWith('http') ? data.githubLink : `https://${data.githubLink}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">GitHub</a>}
        </div>
      )}

      <Section title="Summary">
        {isEditing ? (
          <textarea
            value={data.professionalSummary}
            onChange={(e) => handleInputChange('professionalSummary', e.target.value)}
            className="w-full px-3 py-2 rounded-2xl bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-center"
            rows={4}
          />
        ) : (
          <p>{data.professionalSummary}</p>
        )}
      </Section>

      <Section title="Experience">
        {(data.employmentHistory || []).map((job, index) => (
          <div key={index} className="mb-6 relative">
            {isEditing ? (
              <>
                <div className="grid grid-cols-2 gap-4 mb-2">
                  <input type="text" placeholder="Job Title" value={job.jobTitle} onChange={(e) => handleHistoryChange(index, 'jobTitle', e.target.value)} className="w-full px-3 py-2 rounded-full bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-center" />
                  <input type="text" placeholder="Company" value={job.company} onChange={(e) => handleHistoryChange(index, 'company', e.target.value)} className="w-full px-3 py-2 rounded-full bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-center" />
                  <div className="flex items-center gap-2">
                    <input className="w-1/2 px-3 py-2 rounded-full bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-center" type="date" placeholder="Start Date" value={job.startDate} onChange={(e) => handleHistoryChange(index, 'startDate', e.target.value)} />
                    <span>-</span>
                    <input className="w-1/2 px-3 py-2 rounded-full bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-center"  type="date" placeholder="End Date" value={job.endDate} onChange={(e) => handleHistoryChange(index, 'endDate', e.target.value)} />
                  </div>
                </div>
                <textarea className="w-full px-3 py-2 rounded-2xl bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-center" placeholder="Description" value={job.description} onChange={(e) => handleHistoryChange(index, 'description', e.target.value)} rows={3} />
                
                <div className="text-right">
                          <button
                            type="button"
                            onClick={() => removeHistoryEntry(index)}
                            className="text-red-500 hover:text-red-700 cursor-pointer text-sm font-medium"
                          >
                            Remove
                          </button>
                        </div>
              </>
            ) : (
              <>
                <h3 className="text-lg font-semibold">{job.company}</h3>
                <p className="font-medium"> {job.jobTitle}</p>
                <p className="text-sm text-gray-500">{job.startDate} - {job.endDate}</p>
                <p className="mt-2">{job.description}</p>
              </>
            )}
          </div>
        ))}
        {isEditing && <button onClick={addHistoryEntry} className="text-blue-500 hover:underline mt-2">+ Add Employment</button>}
      </Section>

      {((data.projects && data.projects.length > 0) || isEditing) && (
        <Section title="Projects">
          {(data.projects || []).map((project, index) => (
            <div key={index} className="mb-6 relative">
              {isEditing ? (
                <>
                  <div className="grid grid-cols-2 gap-4 mb-2">
                    <input type="text" placeholder="Project Name" value={project.projectName} onChange={(e) => handleProjectChange(index, 'projectName', e.target.value)} className="w-full px-3 py-2 rounded-full bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-center" />
                    <input type="text" placeholder="Link" value={project.link} onChange={(e) => handleProjectChange(index, 'link', e.target.value)} className="w-full px-3 py-2 rounded-full bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-center" />
                  </div>
                  <input type="text" placeholder="Stacks (comma-separated)" value={project.stacks} onChange={(e) => handleProjectChange(index, 'stacks', e.target.value)} className="w-full px-3 py-2 rounded-full bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-center" />
                  <textarea className="w-full px-3 py-2 rounded-2xl bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-center mt-2" placeholder="Description" value={project.description} onChange={(e) => handleProjectChange(index, 'description', e.target.value)} rows={3} />
                  <div className="text-right">
                            <button
                              type="button"
                              onClick={() => removeProjectEntry(index)}
                              className="text-red-500 hover:text-red-700 cursor-pointer text-sm font-medium"
                            >
                              Remove
                            </button>
                          </div>
                </>
              ) : (
                <>
                  <h3 className="text-lg font-semibold">{project.projectName}</h3>
                  <p className="mt-2">{project.description}</p>
                  <p className="font-medium">{project.stacks}</p>
                  {project.link && <a href={project.link.startsWith('http') ? project.link : `https://${project.link}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">View Project</a>}
                </>
              )}
            </div>
          ))}
          {isEditing && <button onClick={addProjectEntry} className="text-blue-500 hover:underline mt-2">+ Add Project</button>}
        </Section>
      )}

      <Section title="Skills">
        {isEditing ? (
          <textarea
            value={data.skills}
            onChange={(e) => handleInputChange('skills', e.target.value)}
            className="w-full px-3 py-2 rounded-2xl bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-center"
            rows={3}
            placeholder="Comma-separated skills..."
          />
        ) : (
          <p>{data.skills}</p>
        )}
      </Section>

      <Section title="Additional Details">
        {isEditing ? (
          <textarea
            value={data.additionalDetails}
            onChange={(e) => handleInputChange('additionalDetails', e.target.value)}
            className="w-full px-3 py-2 rounded-2xl bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-center"
            rows={3}
          />
        ) : (
          <p>{data.additionalDetails}</p>
        )}
      </Section>
    </div>
  );
};

const Section: React.FC<{ title: string, children: React.ReactNode }> = ({ title, children }) => (
  <section className="mb-8">
    <h2 className="text-lg font-bold border-b-2 border-gray-200 pb-2 mb-4">{title}</h2>
    {children}
  </section>
);
