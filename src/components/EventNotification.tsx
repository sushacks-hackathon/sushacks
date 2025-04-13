
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useData } from '@/context/DataContext';

interface EventNotificationProps {
  onClose: () => void;
}

const EventNotification: React.FC<EventNotificationProps> = ({ onClose }) => {
  const { calendarEvents, updateCalendarEvent } = useData();
  const [currentEvent, setCurrentEvent] = useState<any>(null);
  const [open, setOpen] = useState(false);
  
  useEffect(() => {
    // Check for events that have reminders due
    const checkReminders = () => {
      const now = new Date();
      
      for (const event of calendarEvents) {
        // Find the first untriggered reminder that's due
        const dueReminder = event.reminders.find(reminder => {
          const reminderTime = new Date(reminder.time);
          return !reminder.triggered && reminderTime <= now;
        });
        
        if (dueReminder) {
          // Mark this reminder as triggered
          const updatedEvent = {
            ...event,
            reminders: event.reminders.map(r => 
              r.id === dueReminder.id ? { ...r, triggered: true } : r
            )
          };
          
          // Update the event in storage
          updateCalendarEvent(updatedEvent);
          
          // Show notification
          setCurrentEvent({
            ...event,
            reminder: dueReminder
          });
          setOpen(true);
          
          // Only process one notification at a time
          break;
        }
      }
    };
    
    // Check immediately on component mount
    checkReminders();
    
    // Set up interval to check regularly
    const intervalId = setInterval(checkReminders, 60000); // Check every minute
    
    return () => clearInterval(intervalId);
  }, [calendarEvents, updateCalendarEvent]);
  
  const handleClose = () => {
    setOpen(false);
    setCurrentEvent(null);
    onClose();
  };
  
  const handleGoToApplication = () => {
    if (currentEvent && currentEvent.url) {
      window.open(currentEvent.url, '_blank');
    }
    handleClose();
  };
  
  if (!currentEvent) return null;
  
  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Reminder: {currentEvent.title}</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p>{currentEvent.description || `It's time for your ${currentEvent.type}!`}</p>
          <p className="text-sm text-muted-foreground mt-2">
            {new Date(currentEvent.start).toLocaleString()}
          </p>
        </div>
        <DialogFooter className="flex gap-2">
          <Button 
            variant="outline"
            onClick={handleClose}
          >
            Dismiss
          </Button>
          {currentEvent.url && (
            <Button 
              className="bg-ipblue-600 hover:bg-ipblue-700"
              onClick={handleGoToApplication}
            >
              Go to Application
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EventNotification;
