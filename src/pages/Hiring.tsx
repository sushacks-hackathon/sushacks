
import React, { useState, useEffect, useMemo } from 'react';
import NavBar from '@/components/NavBar';
import JobCard from '@/components/JobCard';
import { useData } from '@/context/DataContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

// Define the database response type
interface SupabaseJobResponse {
  job_id: string | null;
  job_title: string | null;
  company_name: string | null;
  job_location: string | null;
  job_type: string | null;
  salary_range: string | null;
  experience_required: string | null;
  posted_date: string | null;
  application_deadline: string | null;
  job_portal: string | null;
  number_of_applicants: number | null;
  education_requirement: string | null;
  skills_required: string | null;
  remote_onsite: string | null;
  company_size: string | null;
}

// Define our app's job type with guaranteed id
interface JobData {
  id: string;
  role: string;
  company: string;
  location: string;
  jobType: string;
  salary: string;
  experience: string;
  postedDate: string;
  deadline: string;
  applyLink: string;
  applicants: number;
  education: string;
  skills: string;
  mode: 'offline' | 'online' | 'hybrid';
  companySize: string;
  description: string;
}

const Hiring: React.FC = () => {
  const { savedJobs, saveJob, unsaveJob } = useData();
  
  // State for jobs from Supabase
  const [supabaseJobs, setSupabaseJobs] = useState<JobData[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [role, setRole] = useState('all');
  const [mode, setMode] = useState<'all' | 'offline' | 'online' | 'hybrid'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Fetch jobs from Supabase
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('job_markets')
          .select('*')
          .order('posted_date', { ascending: false });
        
        if (error) throw error;
        
        // Transform the data to match our app's format
        const transformedJobs = (data || []).map((job: SupabaseJobResponse) => {
          // Determine job mode based on remote_onsite field
          let jobMode: 'offline' | 'online' | 'hybrid' = 'offline';
          if (job.remote_onsite) {
            const mode = job.remote_onsite.toLowerCase();
            if (mode.includes('remote')) jobMode = 'online';
            else if (mode.includes('hybrid')) jobMode = 'hybrid';
          }
          
          // Create description from various fields
          const description = `
            ${job.job_type || ''} 
            ${job.experience_required ? '• ' + job.experience_required : ''} 
            ${job.education_requirement ? '• ' + job.education_requirement : ''}
            ${job.skills_required ? '• Skills: ' + job.skills_required : ''}
          `.trim();
          
          return {
            id: job.job_id || `job-${Math.random().toString(36).substring(2, 9)}`,
            role: job.job_title || 'Unknown Position',
            company: job.company_name || 'Unknown Company',
            location: job.job_location || 'Location not specified',
            jobType: job.job_type || 'Not specified',
            salary: job.salary_range || 'Not disclosed',
            experience: job.experience_required || 'Not specified',
            postedDate: job.posted_date || 'Unknown',
            deadline: job.application_deadline || 'Open until filled',
            applyLink: job.job_portal || '#',
            applicants: job.number_of_applicants || 0,
            education: job.education_requirement || 'Not specified',
            skills: job.skills_required || 'Not specified',
            mode: jobMode,
            companySize: job.company_size || 'Not specified',
            description
          };
        });
        
        setSupabaseJobs(transformedJobs);
      } catch (err) {
        console.error('Error fetching jobs:', err);
        toast.error('Failed to fetch job listings');
      } finally {
        setLoading(false);
      }
    };
    
    fetchJobs();
  }, []);
  
  // Get unique roles for filter options
  const uniqueRoles = useMemo(() => {
    const roles = new Set(supabaseJobs.map(job => job.role));
    return Array.from(roles);
  }, [supabaseJobs]);
  
  // Filter jobs based on selected criteria
  const filteredJobs = useMemo(() => {
    return supabaseJobs.filter(job => {
      const matchesRole = role === 'all' || job.role === role;
      const matchesMode = mode === 'all' || job.mode === mode;
      const matchesSearch = !searchQuery || 
        job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.location.toLowerCase().includes(searchQuery.toLowerCase());
      
      return matchesRole && matchesMode && matchesSearch;
    });
  }, [supabaseJobs, role, mode, searchQuery]);
  
  // Handle save/unsave job
  const handleSaveJob = (id: string) => {
    saveJob(id);
    toast.success('Job saved to your collection');
  };
  
  const handleUnsaveJob = (id: string) => {
    unsaveJob(id);
    toast.success('Job removed from your collection');
  };
  
  // Reset filters
  const handleResetFilters = () => {
    setRole('all');
    setMode('all');
    setSearchQuery('');
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Job Opportunities</h1>
          <p className="text-gray-600 mt-1">Explore full-time job opportunities across various roles</p>
        </div>
        
        {/* Filters */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <Label htmlFor="search">Search</Label>
              <Input
                id="search"
                placeholder="Search by company, role, or location"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="role">Role</Label>
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  {uniqueRoles.map(role => (
                    <SelectItem key={role} value={role}>{role}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="mode">Work Mode</Label>
              <Select 
                value={mode} 
                onValueChange={(value) => setMode(value as 'all' | 'offline' | 'online' | 'hybrid')}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Modes</SelectItem>
                  <SelectItem value="offline">On-site</SelectItem>
                  <SelectItem value="online">Remote</SelectItem>
                  <SelectItem value="hybrid">Hybrid</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex justify-end">
            <Button variant="outline" onClick={handleResetFilters}>Reset Filters</Button>
          </div>
        </div>
        
        {/* Results */}
        <div className="mb-4">
          <h2 className="text-xl font-medium">
            {loading ? 'Loading jobs...' : 
              `${filteredJobs.length} ${filteredJobs.length === 1 ? 'result' : 'results'} found`}
          </h2>
        </div>
        
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-64 bg-gray-100 animate-pulse rounded-lg"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJobs.map(job => (
              <JobCard
                key={job.id}
                id={job.id}
                company={job.company}
                role={job.role}
                mode={job.mode}
                description={`
                  ${job.location} • ${job.jobType}
                  ${job.postedDate ? `• Posted: ${job.postedDate}` : ''}
                  ${job.deadline ? `• Deadline: ${job.deadline}` : ''}
                  ${job.salary ? `• Salary: ${job.salary}` : ''}
                  ${job.experience ? `• Experience: ${job.experience}` : ''}
                  ${job.education ? `• Education: ${job.education}` : ''}
                  ${job.skills ? `• Skills: ${job.skills}` : ''}
                  ${job.companySize ? `• Company Size: ${job.companySize}` : ''}
                  ${job.applicants ? `• Applicants: ${job.applicants}` : ''}
                `.trim()}
                applyLink={job.applyLink}
                isSaved={savedJobs.includes(job.id)}
                onSave={() => handleSaveJob(job.id)}
                onUnsave={() => handleUnsaveJob(job.id)}
              />
            ))}
          </div>
        )}
        
        {!loading && filteredJobs.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs match your filters</h3>
            <p className="text-gray-500">Try adjusting your filters or search criteria</p>
            <Button variant="outline" className="mt-4" onClick={handleResetFilters}>
              Reset Filters
            </Button>
          </div>
        )}
      </main>
    </div>
  );
};

export default Hiring;
