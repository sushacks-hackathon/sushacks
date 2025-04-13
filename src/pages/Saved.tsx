
import React from 'react';
import NavBar from '@/components/NavBar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useData } from '@/context/DataContext';
import SavedInternships from '@/components/saved/SavedInternships';
import SavedJobs from '@/components/saved/SavedJobs';

const Saved: React.FC = () => {
  const { savedInternships, savedJobs } = useData();
  
  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Saved Items</h1>
          <p className="text-gray-600 mt-1">View and manage your saved internships and jobs</p>
        </div>
        
        <Tabs defaultValue="internships" className="space-y-6">
          <TabsList>
            <TabsTrigger value="internships">Internships ({savedInternships.length})</TabsTrigger>
            <TabsTrigger value="jobs">Jobs ({savedJobs.length})</TabsTrigger>
          </TabsList>
          
          <TabsContent value="internships" className="space-y-6">
            <SavedInternships />
          </TabsContent>
          
          <TabsContent value="jobs" className="space-y-6">
            <SavedJobs />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Saved;
