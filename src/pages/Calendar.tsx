import React, { useState, useEffect, useMemo } from 'react';
import { format, isSameDay, parseISO, isToday, differenceInCalendarDays, isSameMinute } from 'date-fns';
import { Calendar as CalendarIcon, Trash2, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Calendar } from '@/components/ui/calendar';
import { toast } from 'sonner';

type Event = {
  id: number;
  date: string;
  time: string;
  description: string;
  url: string;
  completed: boolean;
  notified?: boolean; // Optional to prevent TS errors
};

const CalendarPage = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [events, setEvents] = useState<Event[]>([]);
  const [time, setTime] = useState('');
  const [description, setDescription] = useState('');
  const [url, setUrl] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('events');
    if (saved) setEvents(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('events', JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      events.forEach(event => {
        const eventDateTime = new Date(`${event.date}T${event.time}`);
        if (
          isSameMinute(now, eventDateTime) &&
          !event.completed &&
          !event.notified
        ) {
          toast(`⏰ Event Reminder: ${event.description}`, {
            action: {
              label: 'Visit Website',
              onClick: () => window.open(event.url, '_blank'),
            },
          });
          setEvents(prev =>
            prev.map(e =>
              e.id === event.id ? { ...e, notified: true } : e
            )
          );
        }
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [events]);

  const handleAddEvent = () => {
    if (!selectedDate || !time || !description || !url) {
      toast.error('Please fill all fields');
      return;
    }

    const newEvent: Event = {
      id: Date.now(),
      date: format(selectedDate, 'yyyy-MM-dd'),
      time,
      description,
      url,
      completed: false,
    };
    setEvents([...events, newEvent]);
    setTime('');
    setDescription('');
    setUrl('');
    toast.success('Event added!');
  };

  const eventsForSelectedDate = useMemo(() => {
    return events.filter(event =>
      selectedDate && isSameDay(parseISO(event.date), selectedDate)
    );
  }, [events, selectedDate]);

  const markComplete = (id: number) => {
    setEvents(events.map(e => e.id === id ? { ...e, completed: true } : e));
  };

  const deleteEvent = (id: number) => {
    setEvents(events.filter(e => e.id !== id));
  };

  const getBorderColor = (event: Event) => {
    if (event.completed) return 'border-green-500 bg-green-100';
    const daysDiff = differenceInCalendarDays(new Date(event.date), new Date());
    if (isToday(parseISO(event.date))) return 'border-red-500 bg-red-100';
    if (daysDiff > 0 && daysDiff <= 3) return 'border-yellow-500 bg-yellow-100';
    return 'border-gray-300';
  };

  const dateHasEvent = (date: Date) => {
    return events.some(event =>
      isSameDay(date, parseISO(event.date)) && !event.completed
    );
  };

  return (
    <div className="p-6 flex flex-col lg:flex-row gap-6">
      <div className="w-full lg:w-1/3 space-y-4">
        <div>
          <h1 className="text-3xl font-bold text-purple-600">Deadline Dream Dates</h1>
          <p className="text-muted-foreground">Manage your events and deadlines</p>
        </div>

        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={setSelectedDate}
          modifiers={{
            highlighted: date => dateHasEvent(date),
          }}
          modifiersClassNames={{
            highlighted: 'bg-red-500 text-white',
          }}
        />

        <Card>
          <CardContent className="p-4 space-y-3">
            <h2 className="font-semibold text-lg">Create New Event</h2>
            <div>
              <label className="text-sm">Date</label>
              <Input
                type="text"
                value={selectedDate ? format(selectedDate, 'PPP') : ''}
                readOnly
              />
            </div>
            <div>
              <label className="text-sm">Time</label>
              <Input
                type="time"
                value={time}
                onChange={e => setTime(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm">Description</label>
              <Input
                type="text"
                value={description}
                onChange={e => setDescription(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm">Website URL</label>
              <Input
                type="url"
                value={url}
                onChange={e => setUrl(e.target.value)}
              />
            </div>
            <Button className="w-full" onClick={handleAddEvent}>Add Event</Button>
          </CardContent>
        </Card>
      </div>

      <div className="w-full lg:w-2/3 space-y-4">
        <h2 className="text-xl font-semibold">
          {selectedDate ? `Events for ${format(selectedDate, 'PPP')}` : 'Select a date'}
        </h2>
        {eventsForSelectedDate.length === 0 ? (
          <p className="text-muted-foreground">No events for {format(selectedDate!, 'PPP')}</p>
        ) : (
          eventsForSelectedDate.map(event => (
            <Card key={event.id} className={cn('border-2', getBorderColor(event))}>
              <CardContent className="p-4 space-y-2">
                <div className="flex justify-between">
                  <div>
                    <p className="text-lg font-semibold">{format(new Date(`${event.date}T${event.time}`), 'p')}</p>
                    <p className="text-sm text-muted-foreground">{format(parseISO(event.date), 'PPP')}</p>
                  </div>
                  <div className="text-sm text-red-500 font-bold">
                    {!event.completed && isToday(parseISO(event.date)) && 'Due Today'}
                  </div>
                </div>
                <p>{event.description}</p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => window.open(event.url, '_blank')}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" /> Visit Website
                  </Button>
                  {!event.completed && (
                    <Button
                      variant="success"
                      onClick={() => markComplete(event.id)}
                    >
                      ✓ Mark Complete
                    </Button>
                  )}
                  <Button
                    variant="destructive"
                    onClick={() => deleteEvent(event.id)}
                  >
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default CalendarPage;
