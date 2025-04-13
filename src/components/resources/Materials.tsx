
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, FileText, ExternalLink } from 'lucide-react';

interface Material {
  id: string;
  title: string;
  category: string;
  description: string;
  link: string;
}

const materialsList: Material[] = [
  {
    id: 'mat-1',
    title: 'Data Structures & Algorithms Handbook',
    category: 'CS Fundamentals',
    description: 'Comprehensive guide to essential data structures and algorithms for technical interviews.',
    link: 'https://example.com/materials/dsa'
  },
  {
    id: 'mat-2',
    title: 'System Design Interview Guide',
    category: 'Architecture',
    description: 'Learn how to approach system design questions and create scalable architectures.',
    link: 'https://example.com/materials/system-design'
  },
  {
    id: 'mat-3',
    title: 'Frontend Development Roadmap',
    category: 'Web Development',
    description: 'Complete path to becoming a professional frontend developer with latest technologies.',
    link: 'https://example.com/materials/frontend'
  },
  {
    id: 'mat-4',
    title: 'SQL Mastery Guide',
    category: 'Databases',
    description: 'From basic queries to advanced database concepts for interviews.',
    link: 'https://example.com/materials/sql'
  },
  {
    id: 'mat-5',
    title: 'Behavioral Interview Preparation Kit',
    category: 'Soft Skills',
    description: 'How to structure your experiences using the STAR method and ace behavioral questions.',
    link: 'https://example.com/materials/behavioral'
  },
  {
    id: 'mat-6',
    title: 'Machine Learning Interview Questions',
    category: 'AI/ML',
    description: 'Most common ML concepts and algorithms asked in technical interviews.',
    link: 'https://example.com/materials/ml'
  },
  {
    id: 'mat-7',
    title: 'Coding Interview Cheat Sheet',
    category: 'CS Fundamentals',
    description: 'Quick reference for common algorithms, time complexities, and problem-solving patterns.',
    link: 'https://example.com/materials/cheatsheet'
  },
  {
    id: 'mat-8',
    title: 'Object-Oriented Programming Deep Dive',
    category: 'Programming',
    description: 'Comprehensive guide to OOP principles, design patterns, and implementation details.',
    link: 'https://example.com/materials/oop'
  },
  {
    id: 'mat-9',
    title: 'Resume & Portfolio Building Guide',
    category: 'Career',
    description: 'How to craft a standout resume and portfolio that gets you interviews.',
    link: 'https://example.com/materials/resume'
  }
];

export const Materials: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Materials</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {materialsList.map((material) => (
          <Card key={material.id} className="h-full hover:shadow-md transition-shadow duration-300">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{material.title}</CardTitle>
                <Badge variant="secondary" className="bg-ipblue-600 text-white">
                  {material.category}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pb-4">
              <p className="text-sm text-muted-foreground">{material.description}</p>
            </CardContent>
            <CardFooter className="pt-0">
              <Button 
                asChild 
                className="w-full gap-2 bg-ipblue-600 hover:bg-ipblue-700"
              >
                <a href={material.link} target="_blank" rel="noopener noreferrer">
                  <FileText className="h-4 w-4" />
                  View Material <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};
