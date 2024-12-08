import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { toast } from '@/components/ui/use-toast';
import { initDB, saveEvents, getEvents } from '@/utils/indexedDB';
import { Event as CustomEvent } from "@/types/event";

interface EventContextType {
  events: CustomEvent[];
  addEvent: (event: CustomEvent) => void;
  updateEvent: (event: CustomEvent) => void;
  deleteEvent: (id: number) => void;
}

const EventContext = createContext<EventContextType | undefined>(undefined);

export function EventProvider({ children }: { children: ReactNode }) {
  const [events, setEvents] = useState<CustomEvent[]>([]);

  useEffect(() => {
    // Load events when component mounts
    getEvents().then(setEvents).catch(console.error);
  }, []);

  useEffect(() => {
    // Save events whenever they change
    if (events.length > 0) {
      saveEvents(events).catch(error => {
        console.error('Error saving events:', error);
        toast({
          title: "Error",
          description: "Failed to save events",
          variant: "destructive"
        });
      });
    }
  }, [events]);

  const addEvent = async (newEvent: CustomEvent) => {
    try {
      setEvents(prevEvents => [...prevEvents, newEvent]);
    } catch (error) {
      console.error('Error adding event:', error);
      toast({
        title: "Error",
        description: "Failed to add event",
        variant: "destructive"
      });
    }
  };

  const updateEvent = async (updatedEvent: CustomEvent) => {
    try {
      setEvents(prevEvents => 
        prevEvents.map(event => 
          event.id === updatedEvent.id ? updatedEvent : event
        )
      );
    } catch (error) {
      console.error('Error updating event:', error);
      throw error;
    }
  };

  const deleteEvent = (id: number) => {
    setEvents(prevEvents => {
      const newEvents = prevEvents.filter(event => event.id !== id);
      return newEvents;
    });
  };

  return (
    <EventContext.Provider value={{ events, addEvent, updateEvent, deleteEvent }}>
      {children}
    </EventContext.Provider>
  );
}

export function useEvents() {
  const context = useContext(EventContext);
  if (context === undefined) {
    throw new Error('useEvents must be used within an EventProvider');
  }
  return context;
} 