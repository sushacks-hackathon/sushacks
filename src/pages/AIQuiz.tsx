
import React from 'react';
import NavBar from '@/components/NavBar';
import { QuizGenerator } from '@/components/resources/QuizGenerator';

const AIQuiz: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">AI Quiz Generator</h1>
          <p className="text-gray-600 mt-1">Generate custom interview questions based on your requirements</p>
        </div>
        
        <div className="space-y-6">
          <QuizGenerator />
        </div>
      </main>
    </div>
  );
};

export default AIQuiz;
