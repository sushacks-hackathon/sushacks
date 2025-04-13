
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bookmark, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';

interface InternshipCardProps {
  id: string;
  company: string;
  role: string;
  period: string;
  mode: 'offline' | 'online';
  description: string;
  applyLink: string;
  isSaved: boolean;
  onSave: () => void;
  onUnsave: () => void;
}

const InternshipCard: React.FC<InternshipCardProps> = ({
  id,
  company,
  role,
  period,
  mode,
  description,
  applyLink,
  isSaved,
  onSave,
  onUnsave
}) => {
  return (
    <Card className="h-full hover:shadow-md transition-shadow duration-300">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{role}</CardTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={isSaved ? onUnsave : onSave}
            className={cn(isSaved && "text-ipblue-600")}
          >
            <Bookmark className={cn("h-5 w-5", isSaved ? "fill-current" : "")} />
          </Button>
        </div>
        <div className="text-sm font-semibold text-ipblue-700">{company}</div>
      </CardHeader>
      <CardContent className="pb-4">
        <div className="flex flex-wrap gap-2 mb-3">
          <Badge variant="secondary">{period}</Badge>
          <Badge variant={mode === 'online' ? 'outline' : 'default'}>
            {mode === 'online' ? 'Remote' : 'On-site'}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-3">{description}</p>
      </CardContent>
      <CardFooter className="pt-0">
        <Button 
          asChild 
          className="w-full bg-ipblue-600 hover:bg-ipblue-700 gap-2"
        >
          <a href={applyLink} target="_blank" rel="noopener noreferrer">
            Apply <ExternalLink className="h-4 w-4" />
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default InternshipCard;
