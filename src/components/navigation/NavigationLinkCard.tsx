
import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';

interface NavigationLinkCardProps {
  title: string;
  url: string;
  position?: string;
}

const NavigationLinkCard: React.FC<NavigationLinkCardProps> = ({
  title,
  url,
  position
}) => {
  return (
    <Card className="overflow-hidden transition-all duration-200 hover:shadow-md">
      <CardContent className="p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
        {position && (
          <p className="text-sm text-gray-500 mb-4">Position: {position}</p>
        )}
      </CardContent>
      <CardFooter className="bg-gray-50 p-4">
        <Button 
          asChild 
          className="w-full bg-ipblue-600 hover:bg-ipblue-700 gap-2"
        >
          <a href={url} target="_blank" rel="noopener noreferrer">
            Visit Link <ExternalLink className="h-4 w-4" />
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default NavigationLinkCard;
