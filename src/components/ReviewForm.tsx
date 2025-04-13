
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useData } from '@/context/DataContext';

interface ReviewFormProps {
  isOpen: boolean;
  onClose: () => void;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ isOpen, onClose }) => {
  const { addCompanyReview } = useData();
  
  const [company, setCompany] = useState('');
  const [position, setPosition] = useState('');
  const [positionType, setPositionType] = useState<'internship' | 'job'>('internship');
  const [rating, setRating] = useState<number>(3);
  const [review, setReview] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    addCompanyReview({
      company,
      position,
      positionType,
      rating,
      review
    });
    
    // Reset form
    setCompany('');
    setPosition('');
    setPositionType('internship');
    setRating(3);
    setReview('');
    
    onClose();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Company Review</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="company">Company Name</Label>
            <Input
              id="company"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="Enter company name"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="position">Position</Label>
            <Input
              id="position"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              placeholder="Enter your position/role"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="positionType">Position Type</Label>
            <Select 
              value={positionType} 
              onValueChange={(value) => setPositionType(value as 'internship' | 'job')}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select position type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="internship">Internship</SelectItem>
                <SelectItem value="job">Full-time Job</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="rating">Rating (1-5)</Label>
            <div className="flex space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Button
                  key={star}
                  type="button"
                  variant={rating >= star ? "default" : "outline"}
                  size="sm"
                  className={rating >= star ? "bg-ipblue-600 hover:bg-ipblue-700" : ""}
                  onClick={() => setRating(star)}
                >
                  {star}
                </Button>
              ))}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="review">Your Review</Label>
            <Textarea
              id="review"
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="Share your experience..."
              rows={5}
              required
            />
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-ipblue-600 hover:bg-ipblue-700">
              Submit Review
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ReviewForm;
