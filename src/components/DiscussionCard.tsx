
import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ThumbsUp, MessageCircle } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/context/AuthContext';
import { formatDistanceToNow } from 'date-fns';

interface Reply {
  id: string;
  userId: string;
  username: string;
  content: string;
  timestamp: string;
  likes: string[];
}

interface DiscussionCardProps {
  id: string;
  userId: string;
  username: string;
  title: string;
  content: string;
  timestamp: string;
  likes: string[];
  replies: Reply[];
  onLike: () => void;
  onReply: (content: string) => void;
  onReplyLike: (replyId: string) => void;
}

const DiscussionCard: React.FC<DiscussionCardProps> = ({
  id,
  userId,
  username,
  title,
  content,
  timestamp,
  likes,
  replies,
  onLike,
  onReply,
  onReplyLike
}) => {
  const { user, isAuthenticated } = useAuth();
  const [replyContent, setReplyContent] = useState('');
  const [isReplying, setIsReplying] = useState(false);
  
  const isLiked = user ? likes.includes(user.id) : false;
  const formattedDate = formatDistanceToNow(new Date(timestamp), { addSuffix: true });
  
  const handleSubmitReply = () => {
    if (replyContent.trim()) {
      onReply(replyContent);
      setReplyContent('');
      setIsReplying(false);
    }
  };
  
  return (
    <Card className="hover:shadow-md transition-shadow duration-300">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{title}</CardTitle>
        <p className="text-sm text-muted-foreground">
          Posted by {username} • {formattedDate}
        </p>
      </CardHeader>
      <CardContent>
        <p className="whitespace-pre-line">{content}</p>
      </CardContent>
      <CardFooter className="pt-0 flex flex-col space-y-2 w-full">
        <div className="flex space-x-2 w-full">
          <Button 
            variant="ghost" 
            size="sm"
            className={`${isLiked ? "text-ipblue-600" : ""}`}
            onClick={onLike}
          >
            <ThumbsUp className={`h-4 w-4 mr-1 ${isLiked ? "animate-pulse" : ""}`} />
            Like
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setIsReplying(!isReplying)}
          >
            <MessageCircle className="h-4 w-4 mr-1" />
            Reply
          </Button>
        </div>
        
        {isReplying && isAuthenticated && (
          <div className="w-full mt-2 space-y-2">
            <Textarea
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder="Write your reply..."
              rows={3}
            />
            <div className="flex justify-end space-x-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setIsReplying(false)}
              >
                Cancel
              </Button>
              <Button 
                size="sm"
                className="bg-ipblue-600 hover:bg-ipblue-700"
                onClick={handleSubmitReply}
                disabled={!replyContent.trim()}
              >
                Submit
              </Button>
            </div>
          </div>
        )}
        
        {replies.length > 0 && (
          <div className="w-full mt-4 space-y-4">
            <div className="text-sm font-medium">Replies ({replies.length})</div>
            {replies.map((reply) => {
              const isReplyLiked = user ? reply.likes.includes(user.id) : false;
              const replyDate = formatDistanceToNow(new Date(reply.timestamp), { addSuffix: true });
              
              return (
                <div key={reply.id} className="border-l-2 border-ipblue-200 pl-4 py-2">
                  <div className="flex justify-between">
                    <p className="text-sm font-medium">{reply.username}</p>
                    <p className="text-xs text-muted-foreground">{replyDate}</p>
                  </div>
                  <p className="text-sm my-1">{reply.content}</p>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className={`${isReplyLiked ? "text-ipblue-600" : ""} p-0 h-auto`}
                    onClick={() => onReplyLike(reply.id)}
                  >
                    <ThumbsUp className={`h-3 w-3 mr-1 ${isReplyLiked ? "animate-pulse" : ""}`} />
                    <span className="text-xs">Like</span>
                  </Button>
                </div>
              );
            })}
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default DiscussionCard;
