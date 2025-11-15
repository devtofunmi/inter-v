import React from 'react';

interface CVTemplateProps {
  name: string;
  jobTitle: string;
  professionalSummary: string;
  employmentHistory: { role: string; startDate: string; endDate: string }[];
  skills: string;
  additionalDetails: string;
}

export const CVTemplate: React.FC<CVTemplateProps> = ({
  name,
  jobTitle,
  professionalSummary,
  employmentHistory,
  skills,
  additionalDetails,
}) => {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', color: '#333', padding: '40px', backgroundColor: '#fff', width: '210mm', height: '297mm' }}>
      <header style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ fontSize: '36px', margin: '0' }}>{name}</h1>
        <p style={{ fontSize: '18px', margin: '5px 0' }}>{jobTitle}</p>
      </header>
      <section>
        <h2 style={{ fontSize: '22px', borderBottom: '2px solid #333', paddingBottom: '5px', marginBottom: '15px' }}>Professional Summary</h2>
        <p style={{ fontSize: '14px', lineHeight: '1.6' }}>{professionalSummary}</p>
      </section>
      <section style={{ marginTop: '30px' }}>
        <h2 style={{ fontSize: '22px', borderBottom: '2px solid #333', paddingBottom: '5px', marginBottom: '15px' }}>Employment History</h2>
        {employmentHistory.map((job, index) => (
          <div key={index} style={{ marginBottom: '15px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 'bold', margin: '0' }}>{job.role}</h3>
            <p style={{ fontSize: '14px', fontStyle: 'italic', margin: '5px 0' }}>{job.startDate} - {job.endDate}</p>
          </div>
        ))}
      </section>
      <section style={{ marginTop: '30px' }}>
        <h2 style={{ fontSize: '22px', borderBottom: '2px solid #333', paddingBottom: '5px', marginBottom: '15px' }}>Skills</h2>
        <p style={{ fontSize: '14px' }}>{skills}</p>
      </section>
      <section style={{ marginTop: '30px' }}>
        <h2 style={{ fontSize: '22px', borderBottom: '2px solid #333', paddingBottom: '5px', marginBottom: '15px' }}>Additional Details</h2>
        <p style={{ fontSize: '14px', lineHeight: '1.6' }}>{additionalDetails}</p>
      </section>
    </div>
  );
};
