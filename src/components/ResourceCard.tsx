
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExternalLink } from 'lucide-react';

interface ResourceCardProps {
  id: string;
  title: string;
  type: 'mock-test' | 'ai-quiz';
  description: string;
  link: string;
}

const ResourceCard: React.FC<ResourceCardProps> = ({
  id,
  title,
  type,
  description,
  link
}) => {
  return (
    <Card className="h-full hover:shadow-md transition-shadow duration-300">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{title}</CardTitle>
          <Badge
            variant={type === 'mock-test' ? 'default' : 'secondary'}
            className={type === 'mock-test' ? 'bg-ipblue-600' : 'bg-ipgreen-600 text-white'}
          >
            {type === 'mock-test' ? 'Mock Test' : 'AI Quiz'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-4">
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardContent>
      <CardFooter className="pt-0">
        <Button 
          asChild 
          className={`w-full gap-2 ${
            type === 'mock-test' 
              ? 'bg-ipblue-600 hover:bg-ipblue-700' 
              : 'bg-ipgreen-600 hover:bg-ipgreen-700'
          }`}
        >
          <a href={link} target="_blank" rel="noopener noreferrer">
            Start {type === 'mock-test' ? 'Test' : 'Quiz'} <ExternalLink className="h-4 w-4" />
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ResourceCard;
