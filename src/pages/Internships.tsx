
import React from 'react';
import NavBar from '@/components/NavBar';
import InternshipsList from '@/components/InternshipsList';

const Internships: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Internships</h1>
          <p className="text-gray-600 mt-1">Find and apply for internships that match your interests</p>
        </div>
        
        <InternshipsList />
      </main>
    </div>
  );
};

export default Internships;
