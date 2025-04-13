import React, { useState, useEffect, useMemo } from 'react';
import NavBar from '@/components/NavBar';
import CalendarEventForm from '@/components/CalendarEventForm';
import EventNotification from '@/components/EventNotification';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useData } from '@/context/DataContext';
import { Plus, ExternalLink, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

// Format date for calendar display
const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

interface CalendarViewProps {
  year: number;
  month: number;
  events: any[];
  onSelectDate: (date: Date) => void;
}

const CalendarView: React.FC<CalendarViewProps> = ({ year, month, events, onSelectDate }) => {
  // Get days in month
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  
  // Get first day of the month
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  
  // Generate calendar days
  const calendarDays = [];
  
  // Add empty cells for days before the first day of month
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push(null);
  }
  
  // Add days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(new Date(year, month, day));
  }
  
  // Group events by date
  const eventsByDate = events.reduce((acc: any, event) => {
    const date = new Date(event.start).toDateString();
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(event);
    return acc;
  }, {});
  
  // Get current date for highlighting
  const today = new Date();
  const currentDateString = today.toDateString();
  
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="grid grid-cols-7 gap-px border-b">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center font-medium text-sm py-2 bg-gray-50">
            {day}
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-7 gap-px">
        {calendarDays.map((date, index) => {
          if (!date) {
            return <div key={`empty-${index}`} className="h-24 p-1 bg-gray-50" />;
          }
          
          const dateString = date.toDateString();
          const isToday = dateString === currentDateString;
          const dateEvents = eventsByDate[dateString] || [];
          
          // Determine if date has events with different statuses
          const hasCompletedEvent = dateEvents.some((e: any) => e.status === 'completed');
          const hasPastEvent = dateEvents.some((e: any) => e.status === 'past');
          const hasUpcomingEvent = dateEvents.some((e: any) => e.status === 'upcoming');
          
          let statusClass = '';
          if (hasCompletedEvent) {
            statusClass = 'border-l-4 border-ipgreen-500';
          } else if (hasPastEvent) {
            statusClass = 'border-l-4 border-ipred-500';
          } else if (hasUpcomingEvent) {
            statusClass = 'border-l-4 border-ipyellow-500';
          }
          
          return (
            <div
              key={dateString}
              className={`h-24 p-1 overflow-hidden transition-all hover:bg-gray-50 cursor-pointer ${statusClass} ${
                isToday ? 'bg-blue-50' : 'bg-white'
              }`}
              onClick={() => onSelectDate(date)}
            >
              <div className={`text-right text-sm ${isToday ? 'font-bold text-ipblue-700' : ''}`}>
                {date.getDate()}
              </div>
              
              <div className="mt-1">
                {dateEvents.slice(0, 2).map((event: any) => (
                  <div 
                    key={event.id} 
                    className={`text-xs truncate px-1 py-0.5 rounded mb-1 ${
                      event.status === 'completed'
                        ? 'bg-ipgreen-100 text-ipgreen-800'
                        : event.status === 'past'
                          ? 'bg-ipred-100 text-ipred-800'
                          : 'bg-ipyellow-100 text-ipyellow-800'
                    }`}
                  >
                    {event.title}
                  </div>
                ))}
                
                {dateEvents.length > 2 && (
                  <div className="text-xs text-gray-500 pl-1">
                    +{dateEvents.length - 2} more
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const Calendar: React.FC = () => {
  const { calendarEvents, updateCalendarEvent, deleteCalendarEvent } = useData();
  
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showEventForm, setShowEventForm] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  
  // Get events for the selected date
  const selectedDateEvents = useMemo(() => {
    if (!selectedDate) return [];
    
    const dateString = selectedDate.toDateString();
    return calendarEvents.filter(event => {
      const eventDate = new Date(event.start).toDateString();
      return eventDate === dateString;
    });
  }, [selectedDate, calendarEvents]);
  
  // Update event statuses based on current time
  useEffect(() => {
    const now = new Date();
    
    calendarEvents.forEach(event => {
      const eventStart = new Date(event.start);
      const eventEnd = new Date(event.end);
      
      let newStatus = event.status;
      
      if (eventEnd < now) {
        newStatus = 'past';
      } else if (eventStart > now) {
        newStatus = 'upcoming';
      }
      
      if (newStatus !== event.status) {
        updateCalendarEvent({
          ...event,
          status: newStatus
        });
      }
    });
  }, [calendarEvents, updateCalendarEvent]);
  
  // Handle month navigation
  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };
  
  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };
  
  // Handle adding/editing events
  const handleAddEvent = () => {
    setSelectedEvent(null);
    setShowEventForm(true);
  };
  
  const handleEditEvent = (event: any) => {
    setSelectedEvent({
      id: event.id,
      title: event.title,
      start: event.start.slice(0, 16),
      end: event.end.slice(0, 16),
      description: event.description,
      url: event.url,
      type: event.type
    });
    setShowEventForm(true);
  };
  
  const handleDeleteEvent = (id: string) => {
    deleteCalendarEvent(id);
    toast.success('Event deleted successfully');
  };
  
  const markEventCompleted = (event: any) => {
    updateCalendarEvent({
      ...event,
      status: 'completed'
    });
    toast.success('Event marked as completed');
  };
  
  // Get formatted month and year
  const formattedMonthYear = currentDate.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric'
  });
  
  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      
      <EventNotification onClose={() => {}} />
      
      {showEventForm && (
        <CalendarEventForm
          isOpen={showEventForm}
          onClose={() => setShowEventForm(false)}
          initialData={selectedEvent}
        />
      )}
      
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Recruitment Calendar</h1>
          <Button 
            onClick={handleAddEvent}
            className="bg-ipblue-600 hover:bg-ipblue-700"
          >
            <Plus className="h-4 w-4 mr-2" /> Add Event
          </Button>
        </div>
        
        <Card className="mb-8">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xl">{formattedMonthYear}</CardTitle>
            <div className="space-x-2">
              <Button variant="outline" size="sm" onClick={previousMonth}>
                Previous
              </Button>
              <Button variant="outline" size="sm" onClick={nextMonth}>
                Next
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <CalendarView
              year={currentDate.getFullYear()}
              month={currentDate.getMonth()}
              events={calendarEvents}
              onSelectDate={setSelectedDate}
            />
          </CardContent>
        </Card>
        
        {selectedDate && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">
                Events for {formatDate(selectedDate)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedDateEvents.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-gray-500">No events scheduled for this date</p>
                  <Button 
                    onClick={handleAddEvent}
                    variant="outline"
                    className="mt-2"
                  >
                    Add Event
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {selectedDateEvents.map(event => (
                    <div 
                      key={event.id} 
                      className={`p-4 rounded-lg border ${
                        event.status === 'completed'
                          ? 'bg-ipgreen-50 border-ipgreen-200'
                          : event.status === 'past'
                            ? 'bg-ipred-50 border-ipred-200'
                            : 'bg-ipyellow-50 border-ipyellow-200'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">{event.title}</h3>
                          <p className="text-sm text-gray-600 mt-1">
                            {new Date(event.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - 
                            {new Date(event.end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                          {event.description && (
                            <p className="text-sm mt-2">{event.description}</p>
                          )}
                          <div className="flex mt-2 space-x-2">
                            {event.status === 'upcoming' && (
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="text-xs h-7"
                                onClick={() => markEventCompleted(event)}
                              >
                                Mark as Completed
                              </Button>
                            )}
                            {event.url && (
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="text-xs h-7"
                                onClick={() => window.open(event.url, '_blank')}
                              >
                                <ExternalLink className="h-3 w-3 mr-1" /> Go to Application
                              </Button>
                            )}
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button 
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditEvent(event)}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-pencil"><path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
                          </Button>
                          <Button 
                            variant="ghost"
                            size="icon"
                            className="text-ipred-500"
                            onClick={() => handleDeleteEvent(event.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default Calendar;
