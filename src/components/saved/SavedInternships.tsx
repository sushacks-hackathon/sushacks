
import React from 'react';
import { useData } from '@/context/DataContext';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bookmark, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface SavedInternshipProps {
  id: string;
}

const SavedInternships: React.FC = () => {
  const { internships, savedInternships, unsaveInternship } = useData();
  
  // Filter internships to show only saved ones
  const savedInternshipsData = internships.filter(internship => 
    savedInternships.includes(internship.id)
  );

  // Handle unsave action
  const handleUnsave = (id: string) => {
    unsaveInternship(id);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Saved Internships</h2>
      
      {savedInternshipsData.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No saved internships</h3>
          <p className="text-gray-500">Internships you save will appear here</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {savedInternshipsData.map(internship => (
            <Card key={internship.id} className="h-full hover:shadow-md transition-shadow duration-300">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{internship.company}</CardTitle>
                  <Badge className="bg-ipblue-600">{internship.mode}</Badge>
                </div>
                <p className="text-sm font-medium">{internship.role}</p>
                <p className="text-xs text-muted-foreground">{internship.period}</p>
              </CardHeader>
              <CardContent className="pb-4">
                <p className="text-sm text-muted-foreground">{internship.description}</p>
              </CardContent>
              <CardFooter className="flex justify-between gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleUnsave(internship.id)}
                >
                  <Bookmark className="h-4 w-4 mr-1 fill-current" />
                  Unsave
                </Button>
                <Button 
                  asChild 
                  size="sm"
                  className="bg-ipblue-600 hover:bg-ipblue-700"
                >
                  <a href={internship.applyLink} target="_blank" rel="noopener noreferrer">
                    Apply <ExternalLink className="h-4 w-4 ml-1" />
                  </a>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedInternships;
