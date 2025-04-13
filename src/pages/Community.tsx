
import React, { useState } from 'react';
import NavBar from '@/components/NavBar';
import ReviewCard from '@/components/ReviewCard';
import DiscussionCard from '@/components/DiscussionCard';
import ReviewForm from '@/components/ReviewForm';
import DiscussionForm from '@/components/DiscussionForm';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useData } from '@/context/DataContext';
import { toast } from 'sonner';

const Community: React.FC = () => {
  const { 
    companyReviews, 
    discussionPosts, 
    toggleReviewLike, 
    toggleReviewDislike,
    addDiscussionReply,
    togglePostLike,
    toggleReplyLike
  } = useData();
  
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [showDiscussionForm, setShowDiscussionForm] = useState(false);
  const [reviewType, setReviewType] = useState<'all' | 'internship' | 'job'>('all');
  
  // Filter reviews based on type
  const filteredReviews = companyReviews.filter(review => {
    if (reviewType === 'all') return true;
    return review.positionType === reviewType;
  });
  
  // Handle like/dislike
  const handleLikeReview = (reviewId: string) => {
    toggleReviewLike(reviewId);
  };
  
  const handleDislikeReview = (reviewId: string) => {
    toggleReviewDislike(reviewId);
  };
  
  const handlePostReply = (postId: string, content: string) => {
    addDiscussionReply(postId, content);
    toast.success('Reply posted successfully');
  };
  
  const handleLikePost = (postId: string) => {
    togglePostLike(postId);
  };
  
  const handleLikeReply = (postId: string, replyId: string) => {
    toggleReplyLike(postId, replyId);
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      
      {showReviewForm && (
        <ReviewForm isOpen={showReviewForm} onClose={() => setShowReviewForm(false)} />
      )}
      
      {showDiscussionForm && (
        <DiscussionForm isOpen={showDiscussionForm} onClose={() => setShowDiscussionForm(false)} />
      )}
      
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Community</h1>
          <p className="text-gray-600 mt-1">Share experiences and connect with other job seekers</p>
        </div>
        
        <Tabs defaultValue="reviews" className="space-y-6">
          <TabsList>
            <TabsTrigger value="reviews">Company Reviews</TabsTrigger>
            <TabsTrigger value="discussions">Discussions</TabsTrigger>
          </TabsList>
          
          <TabsContent value="reviews" className="space-y-6">
            <div className="flex justify-between items-center">
              <div className="w-48">
                <Label htmlFor="review-type">Filter by</Label>
                <Select 
                  value={reviewType} 
                  onValueChange={(value) => setReviewType(value as 'all' | 'internship' | 'job')}
                >
                  <SelectTrigger id="review-type">
                    <SelectValue placeholder="Filter reviews" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Reviews</SelectItem>
                    <SelectItem value="internship">Internships</SelectItem>
                    <SelectItem value="job">Jobs</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button
                onClick={() => setShowReviewForm(true)}
                className="bg-ipblue-600 hover:bg-ipblue-700"
              >
                Add Review
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredReviews.length > 0 ? (
                filteredReviews.map(review => (
                  <ReviewCard
                    key={review.id}
                    id={review.id}
                    userId={review.userId}
                    username={review.username}
                    company={review.company}
                    position={review.position}
                    positionType={review.positionType}
                    rating={review.rating}
                    review={review.review}
                    timestamp={review.timestamp}
                    likes={review.likes}
                    dislikes={review.dislikes}
                    onLike={() => handleLikeReview(review.id)}
                    onDislike={() => handleDislikeReview(review.id)}
                  />
                ))
              ) : (
                <div className="col-span-2 text-center py-12">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No reviews yet</h3>
                  <p className="text-gray-500 mb-4">Be the first to share your experience!</p>
                  <Button 
                    onClick={() => setShowReviewForm(true)}
                    className="bg-ipblue-600 hover:bg-ipblue-700"
                  >
                    Add Review
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="discussions" className="space-y-6">
            <div className="flex justify-end">
              <Button
                onClick={() => setShowDiscussionForm(true)}
                className="bg-ipblue-600 hover:bg-ipblue-700"
              >
                Start Discussion
              </Button>
            </div>
            
            <div className="space-y-6">
              {discussionPosts.length > 0 ? (
                discussionPosts.map(post => (
                  <DiscussionCard
                    key={post.id}
                    id={post.id}
                    userId={post.userId}
                    username={post.username}
                    title={post.title}
                    content={post.content}
                    timestamp={post.timestamp}
                    likes={post.likes}
                    replies={post.replies}
                    onLike={() => handleLikePost(post.id)}
                    onReply={(content) => handlePostReply(post.id, content)}
                    onReplyLike={(replyId) => handleLikeReply(post.id, replyId)}
                  />
                ))
              ) : (
                <div className="text-center py-12">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No discussions yet</h3>
                  <p className="text-gray-500 mb-4">Start a conversation with the community!</p>
                  <Button 
                    onClick={() => setShowDiscussionForm(true)}
                    className="bg-ipblue-600 hover:bg-ipblue-700"
                  >
                    Start Discussion
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Community;
