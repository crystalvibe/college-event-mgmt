import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import { toast } from "@/components/ui/use-toast";
import { EventForm } from "@/components/EventForm";
import { useNavigate } from "react-router-dom";
import { EventCard } from "@/components/EventCard";
import { ViewEventDialog } from "@/components/ViewEventDialog";
import { generateAllEventsPDF } from "@/utils/pdfGenerator";
import { useEvents } from "@/contexts/EventContext";
import sdmLogo from './image-removebg-preview.png';
import { Event as CustomEvent } from "@/types/event";

export default function Events() {
  const { events, addEvent, updateEvent, deleteEvent } = useEvents();
  const [selectedEvent, setSelectedEvent] = useState<CustomEvent | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const userRole = sessionStorage.getItem('userRole');
    const username = sessionStorage.getItem('username');
    
    if (!userRole || !username) {
      toast({
        title: "Authentication Required",
        description: "Please login to access this page",
        variant: "destructive",
      });
      navigate('/');
      return;
    }
  }, [navigate]);

  const handleLogout = () => {
    sessionStorage.removeItem('userRole');
    sessionStorage.removeItem('username');
    navigate('/');
  };

  const handleAddEvent = (eventData: CustomEvent) => {
    const newId = Math.max(...events.map(e => e.id), 0) + 1;
    
    const newEvent = { 
      ...eventData, 
      id: newId,
      title: eventData.title?.trim() || 'Untitled Event',
      date: new Date(eventData.date).toISOString(),
      endDate: eventData.endDate ? new Date(eventData.endDate).toISOString() : undefined,
      coordinator: eventData.coordinator?.trim() || '',
      category: eventData.category || '',
      eventType: eventData.eventType || '',
      department: eventData.department || '',
      venue: eventData.venue?.trim() || '',
      media: eventData.media || []
    };
    
    console.log('Adding new event:', newEvent);
    addEvent(newEvent);
    setIsAddDialogOpen(false);
    toast({
      title: "Success",
      description: "Event added successfully",
    });
  };

  const handleEditEvent = (eventData: CustomEvent) => {
    try {
      console.log('Selected Event:', selectedEvent);
      console.log('Event Data:', eventData);
      
      const updatedEvent = {
        ...selectedEvent,
        ...eventData,
        id: selectedEvent?.id,
        media: eventData.media || selectedEvent?.media
      };

      console.log('Updated Event:', updatedEvent);
      
      updateEvent(updatedEvent);
      setIsEditDialogOpen(false);
      toast({
        title: "Success",
        description: "Event updated successfully",
      });
    } catch (error) {
      console.error('Error updating event:', error);
      toast({
        title: "Error",
        description: "Failed to update event. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleDeleteEvent = (id: number) => {
    deleteEvent(id);
    toast({
      title: "Success",
      description: "Event deleted successfully",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-slate-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col gap-6 mb-8">
          {/* Title and Logout Section */}
          <div className="flex items-center justify-center mb-4 relative">
            <div className="flex items-center gap-4">
              <img 
                src={sdmLogo} 
                alt="SDM Logo" 
                className="h-16 w-auto"
              />
              <h1 className="text-3xl font-bold text-gray-800">
                Sri Dharmasthala Manjunatheshwara College of Engineering
              </h1>
            </div>
            <Button 
              onClick={handleLogout}
              className="absolute right-0 bg-gray-600 hover:bg-gray-700 text-white 
                        rounded-full px-6 py-2"
            >
              Logout
            </Button>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center items-center space-x-4">
            <Button 
              onClick={() => navigate("/dashboard")}
              className="bg-red-600 hover:bg-red-700 text-white rounded-full px-6 py-2 
                        flex items-center gap-2"
            >
              View Dashboard
            </Button>
            <Button 
              onClick={() => navigate("/report")}
              className="bg-red-600 hover:bg-red-700 text-white rounded-full px-6 py-2 
                        flex items-center gap-2"
            >
              Generate Report
            </Button>
            <Button 
              onClick={() => setIsAddDialogOpen(true)} 
              className="bg-red-600 hover:bg-red-700 text-white rounded-full px-6 py-2 
                        flex items-center gap-2"
            >
              Add New Event
            </Button>
          </div>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event: CustomEvent) => (
            <EventCard
              key={event.id}
              event={event}
              onView={() => {
                setSelectedEvent(event);
                setIsViewDialogOpen(true);
              }}
              onEdit={() => {
                setSelectedEvent(event);
                setIsEditDialogOpen(true);
              }}
              onDelete={handleDeleteEvent}
            />
          ))}
        </div>
      </div>

      {/* Add Event Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Event</DialogTitle>
          </DialogHeader>
          <EventForm onSubmit={handleAddEvent} mode="add" />
        </DialogContent>
      </Dialog>

      {/* Edit Event Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Event</DialogTitle>
          </DialogHeader>
          <EventForm onSubmit={handleEditEvent} initialData={selectedEvent} mode="edit" />
        </DialogContent>
      </Dialog>

      {/* View Event Dialog */}
      <ViewEventDialog 
        event={selectedEvent}
        isOpen={isViewDialogOpen}
        onOpenChange={setIsViewDialogOpen}
      />
    </div>
  );
}