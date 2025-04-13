
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bookmark, ExternalLink, Calendar, MapPin, Briefcase, DollarSign } from 'lucide-react';
import { cn } from '@/lib/utils';

interface JobCardProps {
  id: string;
  company: string;
  role: string;
  mode: 'offline' | 'online' | 'hybrid';
  description: string;
  applyLink: string;
  isSaved: boolean;
  onSave: () => void;
  onUnsave: () => void;
}

const JobCard: React.FC<JobCardProps> = ({
  id,
  company,
  role,
  mode,
  description,
  applyLink,
  isSaved,
  onSave,
  onUnsave
}) => {
  return (
    <Card className="h-full hover:shadow-md transition-shadow duration-300 flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-semibold line-clamp-2">{role}</CardTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={isSaved ? onUnsave : onSave}
            className={cn(isSaved && "text-ipblue-600")}
            aria-label={isSaved ? "Unsave job" : "Save job"}
          >
            <Bookmark className={cn("h-5 w-5", isSaved ? "fill-current" : "")} />
          </Button>
        </div>
        <div className="text-sm font-semibold text-ipblue-700">{company}</div>
      </CardHeader>
      <CardContent className="pb-4 flex-grow">
        <div className="flex flex-wrap gap-2 mb-3">
          <Badge 
            variant={
              mode === 'online' 
                ? 'outline' 
                : mode === 'hybrid' 
                  ? 'secondary' 
                  : 'default'
            }
          >
            {mode === 'online' ? 'Remote' : mode === 'hybrid' ? 'Hybrid' : 'On-site'}
          </Badge>
        </div>
        <div className="text-sm text-muted-foreground space-y-2">
          {description.split('\n').filter(Boolean).map((line, index) => (
            <p key={index} className="line-clamp-1">{line.trim()}</p>
          ))}
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <Button 
          asChild 
          className="w-full bg-ipblue-600 hover:bg-ipblue-700 gap-2"
        >
          <a href={applyLink} target="_blank" rel="noopener noreferrer">
            Apply Now <ExternalLink className="h-4 w-4" />
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default JobCard;
