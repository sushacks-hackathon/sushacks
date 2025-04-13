
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { formatDistanceToNow } from 'date-fns';

interface ReviewCardProps {
  id: string;
  userId: string;
  username: string;
  company: string;
  position: string;
  positionType: 'internship' | 'job';
  rating: number;
  review: string;
  timestamp: string;
  likes: string[];
  dislikes: string[];
  onLike: () => void;
  onDislike: () => void;
}

const ReviewCard: React.FC<ReviewCardProps> = ({
  id,
  userId,
  username,
  company,
  position,
  positionType,
  rating,
  review,
  timestamp,
  likes,
  dislikes,
  onLike,
  onDislike
}) => {
  const { user } = useAuth();
  const isLiked = user ? likes.includes(user.id) : false;
  const isDisliked = user ? dislikes.includes(user.id) : false;
  
  const formattedDate = formatDistanceToNow(new Date(timestamp), { addSuffix: true });
  
  return (
    <Card className="hover:shadow-md transition-shadow duration-300">
      <CardHeader className="pb-2">
        <div className="flex flex-wrap justify-between items-start gap-2">
          <div>
            <h3 className="font-semibold text-lg">{company}</h3>
            <p className="text-sm text-muted-foreground">
              {position}
              <Badge 
                variant="outline"
                className="ml-2"
              >
                {positionType === 'internship' ? 'Internship' : 'Job'}
              </Badge>
            </p>
          </div>
          <div className="flex">
            {Array.from({ length: 5 }).map((_, i) => (
              <span 
                key={i}
                className={`text-lg ${i < rating ? 'text-yellow-500' : 'text-gray-300'}`}
              >
                ★
              </span>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm whitespace-pre-line">{review}</p>
        <div className="mt-3 text-xs text-muted-foreground flex justify-between items-center">
          <span>Posted by {username}</span>
          <span>{formattedDate}</span>
        </div>
      </CardContent>
      <CardFooter className="pt-0 flex justify-start space-x-2">
        <Button 
          variant="ghost" 
          size="sm"
          className={isLiked ? "text-ipblue-600" : ""}
          onClick={onLike}
        >
          <ThumbsUp className="h-4 w-4 mr-1" />
        </Button>
        <Button 
          variant="ghost" 
          size="sm"
          className={isDisliked ? "text-ipred-600" : ""}
          onClick={onDislike}
        >
          <ThumbsDown className="h-4 w-4 mr-1" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ReviewCard;
