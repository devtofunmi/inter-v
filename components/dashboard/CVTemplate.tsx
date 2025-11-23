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

export const CVTemplate: React.FC<CVTemplateProps> = ({
  data,
  isEditing = false,
  onDataChange = () => {}
}) => {
  const handleInputChange = (field: keyof CVData, value: CVData[keyof CVData]) => {
    onDataChange({ ...data, [field]: value });
  };

  const handleHistoryChange = (index: number, field: string, value: string) => {
    const newHistory = [...(data.employmentHistory || [])];
    newHistory[index] = { ...newHistory[index], [field]: value };
    handleInputChange("employmentHistory", newHistory);
  };

  const addHistoryEntry = () => {
    const newHistory = [
      ...(data.employmentHistory || []),
      { jobTitle: "", company: "", location: "", startDate: "", endDate: "", description: "" }
    ];
    handleInputChange("employmentHistory", newHistory);
  };

  const removeHistoryEntry = (index: number) => {
    const newHistory = (data.employmentHistory || []).filter((_, i) => i !== index);
    handleInputChange("employmentHistory", newHistory);
  };

  const handleProjectChange = (index: number, field: string, value: string) => {
    const newProjects = [...(data.projects || [])];
    newProjects[index] = { ...newProjects[index], [field]: value };
    handleInputChange("projects", newProjects);
  };

  const addProjectEntry = () => {
    const newProjects = [
      ...(data.projects || []),
      { projectName: "", description: "", stacks: "", link: "" }
    ];
    handleInputChange("projects", newProjects);
  };

  const removeProjectEntry = (index: number) => {
    const newProjects = (data.projects || []).filter((_, i) => i !== index);
    handleInputChange("projects", newProjects);
  };

  return (
    <div
      className="p-8 rounded-xl max-w-4xl mx-auto font-sans"
      style={{
        backgroundColor: "#ffffff",
        color: "#000000",
        border: "1px solid #e5e7eb"
      }}
    >
      {/* NAME */}
      {isEditing ? (
        <input
          type="text"
          value={data.name}
          onChange={(e) => handleInputChange("name", e.target.value)}
          className="w-full px-3 py-2 rounded-full text-2xl font-bold"
          style={{
            background: "#f3f4f6",
            border: "1px solid #d1d5db",
            outline: "none"
          }}
        />
      ) : (
        <h1 className="text-2xl font-bold mb-2">{data.name}</h1>
      )}

      {/* JOB TITLE */}
      {isEditing ? (
        <input
          type="text"
          value={data.jobTitle}
          onChange={(e) => handleInputChange("jobTitle", e.target.value)}
          className="w-full px-3 py-2 rounded-full mt-2 text-lg"
          style={{
            background: "#f3f4f6",
            border: "1px solid #d1d5db",
            outline: "none"
          }}
        />
      ) : (
        <p className="text-lg font-bold mb-2" style={{ color: "#000000" }}>
          {data.jobTitle}
        </p>
      )}

      {/* LINKS */}
      {isEditing ? (
        <div className="grid grid-cols-3 mt-2 gap-4 mb-8">
          {["portfolioLink", "gmailLink", "githubLink"].map((field) => (
            <input
              key={field}
              type="text"
              placeholder={field.replace("Link", " Link")}
              value={(data[field as keyof CVData] as string) ?? ""}
              onChange={(e) => handleInputChange(field as keyof CVData, e.target.value)}
              className="w-full px-3 py-2 rounded-full text-center"
              style={{
                background: "#f3f4f6",
                border: "1px solid #d1d5db",
                outline: "none"
              }}
            />
          ))}
        </div>
      ) : (
        <div className="flex space-x-4 mb-8">
          {data.portfolioLink && (
            <a
              id="portfolio-link"
              href={data.portfolioLink.startsWith("http") ? data.portfolioLink : `https://${data.portfolioLink}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: 'inline-block', color: "#3b82f6",  textDecoration: "underline",cursor: "pointer" }}
            >
              Portfolio
            </a>
          )}
          {data.gmailLink && (
            <a  id="gmail-link" href={`mailto:${data.gmailLink}`}  style={{ display: 'inline-block', color: "#3b82f6",  textDecoration: "underline", cursor: "pointer" }}>
              Email
            </a>
          )}
          {data.githubLink && (
            <a
              id="github-link"
              href={data.githubLink.startsWith("http") ? data.githubLink : `https://${data.githubLink}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: 'inline-block', color: "#3b82f6",  textDecoration: "underline",  cursor: "pointer" }}
            >
              GitHub
            </a>
          )}
        </div>
      )}

      {/* SUMMARY */}
      <Section title="Summary">
        {isEditing ? (
          <textarea
            value={data.professionalSummary}
            onChange={(e) => handleInputChange("professionalSummary", e.target.value)}
            className="w-full px-3 py-2 rounded-2xl text-center"
            style={{
              background: "#f3f4f6",
              border: "1px solid #d1d5db"
            }}
            rows={4}
          />
        ) : (
          <p>{data.professionalSummary}</p>
        )}
      </Section>

      {/* EXPERIENCE */}
      <Section title="Experience">
        {(data.employmentHistory || []).map((job, index) => (
          <div key={index} className="mb-6 relative">
            {isEditing ? (
              <>
                <div className="grid grid-cols-2 gap-4 mb-2">
                  <input
                    type="text"
                    placeholder="Job Title"
                    value={job.jobTitle}
                    onChange={(e) => handleHistoryChange(index, "jobTitle", e.target.value)}
                    className="w-full px-3 py-2 rounded-full text-center"
                    style={{ background: "#f3f4f6", border: "1px solid #d1d5db" }}
                  />

                  <input
                    type="text"
                    placeholder="Company"
                    value={job.company}
                    onChange={(e) => handleHistoryChange(index, "company", e.target.value)}
                    className="w-full px-3 py-2 rounded-full text-center"
                    style={{ background: "#f3f4f6", border: "1px solid #d1d5db" }}
                  />

                  <div className="flex items-center gap-2">
                    <input
                      className="w-1/2 px-3 py-2 rounded-full text-center"
                      style={{ background: "#f3f4f6", border: "1px solid #d1d5db" }}
                      type="date"
                      value={job.startDate}
                      onChange={(e) => handleHistoryChange(index, "startDate", e.target.value)}
                    />
                    <span>-</span>
                    <input
                      className="w-1/2 px-3 py-2 rounded-full text-center"
                      style={{ background: "#f3f4f6", border: "1px solid #d1d5db" }}
                      type="date"
                      value={job.endDate}
                      onChange={(e) => handleHistoryChange(index, "endDate", e.target.value)}
                    />
                  </div>
                </div>

                <textarea
                  className="w-full px-3 py-2 rounded-2xl text-center"
                  style={{ background: "#f3f4f6", border: "1px solid #d1d5db" }}
                  placeholder="Description"
                  value={job.description}
                  onChange={(e) => handleHistoryChange(index, "description", e.target.value)}
                  rows={3}
                />

                <div className="text-right">
                  <button
                    type="button"
                    onClick={() => removeHistoryEntry(index)}
                    style={{ color: "red" }}
                    className="text-sm font-medium"
                  >
                    Remove
                  </button>
                </div>
              </>
            ) : (
              <>
                <h3 className="text-lg font-semibold">{job.company}</h3>
                <p className="font-medium">{job.jobTitle}</p>
                <p style={{ color: "#6b7280" }} className="text-sm">
                  {job.startDate} - {job.endDate}
                </p>
                <p className="mt-2">{job.description}</p>
              </>
            )}
          </div>
        ))}

        {isEditing && (
          <button style={{ color: "#3b82f6" }} onClick={addHistoryEntry}>
            + Add Employment
          </button>
        )}
      </Section>

      {/* PROJECTS */}
      {(data.projects?.length || isEditing) && (
        <Section title="Projects">
          {(data.projects || []).map((project, index) => (
            <div key={index} className="mb-6 relative">
              {isEditing ? (
                <>
                  <div className="grid grid-cols-2 gap-4 mb-2">
                    <input
                      type="text"
                      placeholder="Project Name"
                      value={project.projectName}
                      onChange={(e) => handleProjectChange(index, "projectName", e.target.value)}
                      className="w-full px-3 py-2 rounded-full text-center"
                      style={{ background: "#f3f4f6", border: "1px solid #d1d5db" }}
                    />

                    <input
                      type="text"
                      placeholder="Link"
                      value={project.link}
                      onChange={(e) => handleProjectChange(index, "link", e.target.value)}
                      className="w-full px-3 py-2 rounded-full text-center"
                      style={{ background: "#f3f4f6", border: "1px solid #d1d5db" }}
                    />
                  </div>

                  <input
                    type="text"
                    placeholder="Stacks"
                    value={project.stacks}
                    onChange={(e) => handleProjectChange(index, "stacks", e.target.value)}
                    className="w-full px-3 py-2 rounded-full text-center"
                    style={{ background: "#f3f4f6", border: "1px solid #d1d5db" }}
                  />

                  <textarea
                    placeholder="Description"
                    value={project.description}
                    onChange={(e) => handleProjectChange(index, "description", e.target.value)}
                    className="w-full px-3 py-2 rounded-2xl text-center mt-2"
                    style={{ background: "#f3f4f6", border: "1px solid #d1d5db" }}
                    rows={3}
                  />

                  <div className="text-right">
                    <button
                      type="button"
                      onClick={() => removeProjectEntry(index)}
                      className="text-sm font-medium"
                      style={{ color: "red", }}
                    >
                      Remove
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <h3 className="text-lg font-semibold">{project.projectName}</h3>
                  <p className="mt-2">{project.description}</p>
                  <p className="font-medium" style={{ marginTop: '8px' }}> 
                    <span style={{ fontWeight: 'bold' }}>Stacks:</span> {project.stacks}
                  </p>
                  {project.link && (
                    <div style={{ marginTop: '8px' }}>
                      <a
                        id={`project-link-${index}`}
                        href={project.link.startsWith("http") ? project.link : `https://${project.link}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: 'inline-block',
                          color: "#3b82f6",
                          textDecoration: "underline",
                          cursor: "pointer"
                        }}
                      >
                        View Project
                      </a>
                    </div>
                  )}
                </>
              )}
            </div>
          ))}

          {isEditing && (
            <button style={{ color: "#3b82f6" }} onClick={addProjectEntry}>
              + Add Project
            </button>
          )}
        </Section>
      )}

      {/* SKILLS */}
      <Section title="Skills">
        {isEditing ? (
          <textarea
            value={data.skills}
            onChange={(e) => handleInputChange("skills", e.target.value)}
            className="w-full px-3 py-2 rounded-2xl text-center"
            style={{ background: "#f3f4f6", border: "1px solid #d1d5db" }}
            rows={3}
          />
        ) : (
          <p>{data.skills}</p>
        )}
      </Section>

      {/* ADDITIONAL DETAILS */}
      <Section title="Additional Details">
        {isEditing ? (
          <textarea
            value={data.additionalDetails}
            onChange={(e) => handleInputChange("additionalDetails", e.target.value)}
            className="w-full px-3 py-2 rounded-2xl text-center"
            style={{ background: "#f3f4f6", border: "1px solid #d1d5db" }}
            rows={3}
          />
        ) : (
          <p>{data.additionalDetails}</p>
        )}
      </Section>
    </div>
  );
};

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({
  title,
  children
}) => (
  <section className="mb-8">
    <h2
      className="text-lg font-bold pb-2 mb-4"
      style={{ borderBottom: "2px solid #e5e7eb" }}
    >
      {title}
    </h2>
    {children}
  </section>
);
