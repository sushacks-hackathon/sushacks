
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useData } from '@/context/DataContext';

interface CalendarEventFormProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: {
    id?: string;
    title: string;
    start: string;
    end: string;
    description: string;
    url: string;
    type: 'interview' | 'drive' | 'deadline' | 'reminder';
  };
}

const CalendarEventForm: React.FC<CalendarEventFormProps> = ({ isOpen, onClose, initialData }) => {
  const { addCalendarEvent, updateCalendarEvent } = useData();
  
  const [title, setTitle] = useState(initialData?.title || '');
  const [start, setStart] = useState(initialData?.start || new Date().toISOString().slice(0, 16));
  const [end, setEnd] = useState(initialData?.end || new Date().toISOString().slice(0, 16));
  const [description, setDescription] = useState(initialData?.description || '');
  const [url, setUrl] = useState(initialData?.url || '');
  const [type, setType] = useState<'interview' | 'drive' | 'deadline' | 'reminder'>(
    initialData?.type || 'reminder'
  );
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const eventData = {
      title,
      start,
      end,
      description,
      url,
      type,
      status: 'upcoming' as const,
      reminders: generateReminders(type, new Date(start))
    };
    
    if (initialData?.id) {
      updateCalendarEvent({
        ...eventData,
        id: initialData.id,
        status: 'upcoming',
        reminders: generateReminders(type, new Date(start))
      });
    } else {
      addCalendarEvent(eventData);
    }
    
    onClose();
  };
  
  const generateReminders = (eventType: string, startDate: Date) => {
    const reminders = [];
    const now = new Date();
    
    if (eventType === 'drive') {
      // 2 days before
      const twoDaysBefore = new Date(startDate);
      twoDaysBefore.setDate(startDate.getDate() - 2);
      twoDaysBefore.setHours(9, 0, 0, 0);
      
      if (twoDaysBefore > now) {
        reminders.push({
          id: `rem-${Math.random().toString(36).substring(2, 9)}`,
          time: twoDaysBefore.toISOString(),
          triggered: false
        });
      }
      
      // 1 day before
      const oneDayBefore = new Date(startDate);
      oneDayBefore.setDate(startDate.getDate() - 1);
      oneDayBefore.setHours(9, 0, 0, 0);
      
      if (oneDayBefore > now) {
        reminders.push({
          id: `rem-${Math.random().toString(36).substring(2, 9)}`,
          time: oneDayBefore.toISOString(),
          triggered: false
        });
      }
      
      // On the day
      const onTheDay = new Date(startDate);
      onTheDay.setHours(7, 0, 0, 0);
      
      if (onTheDay > now) {
        reminders.push({
          id: `rem-${Math.random().toString(36).substring(2, 9)}`,
          time: onTheDay.toISOString(),
          triggered: false
        });
      }
    } else if (eventType === 'interview') {
      // 1 day before
      const oneDayBefore = new Date(startDate);
      oneDayBefore.setDate(startDate.getDate() - 1);
      oneDayBefore.setHours(18, 0, 0, 0);
      
      if (oneDayBefore > now) {
        reminders.push({
          id: `rem-${Math.random().toString(36).substring(2, 9)}`,
          time: oneDayBefore.toISOString(),
          triggered: false
        });
      }
      
      // 1 hour before
      const oneHourBefore = new Date(startDate);
      oneHourBefore.setTime(startDate.getTime() - (60 * 60 * 1000));
      
      if (oneHourBefore > now) {
        reminders.push({
          id: `rem-${Math.random().toString(36).substring(2, 9)}`,
          time: oneHourBefore.toISOString(),
          triggered: false
        });
      }
    } else {
      // Default reminder for other types: 1 day before
      const oneDayBefore = new Date(startDate);
      oneDayBefore.setDate(startDate.getDate() - 1);
      oneDayBefore.setHours(9, 0, 0, 0);
      
      if (oneDayBefore > now) {
        reminders.push({
          id: `rem-${Math.random().toString(36).substring(2, 9)}`,
          time: oneDayBefore.toISOString(),
          triggered: false
        });
      }
    }
    
    // Add custom reminder: 30 minutes before for all event types
    const thirtyMinsBefore = new Date(startDate);
    thirtyMinsBefore.setTime(startDate.getTime() - (30 * 60 * 1000));
    
    if (thirtyMinsBefore > now) {
      reminders.push({
        id: `rem-${Math.random().toString(36).substring(2, 9)}`,
        time: thirtyMinsBefore.toISOString(),
        triggered: false
      });
    }
    
    return reminders;
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{initialData?.id ? 'Edit Event' : 'Add New Event'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Event Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter event title"
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start">Start Date & Time</Label>
              <Input
                id="start"
                type="datetime-local"
                value={start}
                onChange={(e) => setStart(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end">End Date & Time</Label>
              <Input
                id="end"
                type="datetime-local"
                value={end}
                onChange={(e) => setEnd(e.target.value)}
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="type">Event Type</Label>
            <Select 
              value={type} 
              onValueChange={(value) => setType(value as any)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select event type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="interview">Interview</SelectItem>
                <SelectItem value="drive">Recruitment Drive</SelectItem>
                <SelectItem value="deadline">Application Deadline</SelectItem>
                <SelectItem value="reminder">Custom Reminder</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter event details"
              rows={3}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="url">URL (optional)</Label>
            <Input
              id="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
              type="url"
            />
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-ipblue-600 hover:bg-ipblue-700">
              {initialData?.id ? 'Update Event' : 'Add Event'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CalendarEventForm;
