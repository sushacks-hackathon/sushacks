import React from 'react';
import JobCard from '@/components/JobCard';
import { useData } from '@/context/DataContext';
import { toast } from 'sonner';

const SavedJobs: React.FC = () => {
  const { jobs, savedJobs, saveJob, unsaveJob } = useData();

  // Get the list of saved job objects
  const savedJobItems = React.useMemo(() => {
    return jobs.filter(job => savedJobs.includes(job.id));
  }, [jobs, savedJobs]);

  const handleSaveJob = (jobId: string) => {
    saveJob(jobId);
    toast.success('Job saved to your collection');
  };

  const handleUnsaveJob = (jobId: string) => {
    unsaveJob(jobId);
    toast.success('Job removed from your collection');
  };

  if (savedJobItems.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900 mb-2">No saved jobs</h3>
        <p className="text-gray-500">Jobs you save will appear here</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {savedJobItems.map(job => (
        <JobCard
          key={job.id}
          id={job.id}
          company={job.company}
          role={job.role}
          mode={job.mode}
          description={job.description}
          applyLink={job.applyLink}
          isSaved={true}
          onSave={() => handleSaveJob(job.id)}
          onUnsave={() => handleUnsaveJob(job.id)}
        />
      ))}
    </div>
  );
};

export default SavedJobs;
