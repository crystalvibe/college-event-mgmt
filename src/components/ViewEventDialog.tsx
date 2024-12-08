import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { generateEventPDF } from "@/utils/pdfGenerator";
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, FileIcon, FileAudio, FileText } from "lucide-react";

interface ViewEventDialogProps {
  event: any;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ViewEventDialog = ({ event, isOpen, onOpenChange }: ViewEventDialogProps) => {
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);

  useEffect(() => {
    if (isOpen && event?.media?.length > 1) {
      const interval = setInterval(() => {
        setCurrentMediaIndex((prev) => (prev + 1) % event.media.length);
      }, 5000); // Change slide every 5 seconds
      return () => clearInterval(interval);
    }
  }, [isOpen, event?.media?.length]);

  if (!event) return null;

  const getMediaPreview = (mediaItem: any) => {
    if (!mediaItem) return null;

    if (mediaItem.type.startsWith('image/')) {
      return (
        <img
          src={mediaItem.data}
          alt="Event media"
          className="w-full h-64 object-cover rounded-lg"
        />
      );
    } else if (mediaItem.type.startsWith('video/')) {
      return (
        <video
          src={mediaItem.data}
          className="w-full h-64 object-cover rounded-lg"
          autoPlay
          loop
          muted
          playsInline
          controls
        />
      );
    } else if (mediaItem.type.startsWith('audio/')) {
      return (
        <div className="w-full bg-gray-100 rounded-lg p-8 flex flex-col items-center">
          <FileAudio className="w-16 h-16 text-gray-400 mb-4" />
          <audio src={mediaItem.data} controls className="w-full" autoPlay />
        </div>
      );
    } else if (mediaItem.type === 'application/pdf') {
      return (
        <div className="w-full h-64 bg-gray-100 rounded-lg flex flex-col items-center justify-center">
          <FileText className="w-16 h-16 text-red-400 mb-4" />
          <p className="text-gray-600 mb-4">PDF Document: {mediaItem.name}</p>
          <Button 
            variant="outline" 
            onClick={() => window.open(mediaItem.data, '_blank')}
          >
            View PDF
          </Button>
        </div>
      );
    } else {
      return (
        <div className="w-full h-64 bg-gray-100 rounded-lg flex flex-col items-center justify-center">
          <FileIcon className="w-16 h-16 text-gray-400 mb-4" />
          <p className="text-gray-500">File: {mediaItem.name}</p>
        </div>
      );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{event.name}</DialogTitle>
        </DialogHeader>
        
        {event.media && event.media.length > 0 && (
          <div className="relative">
            {getMediaPreview(event.media[currentMediaIndex])}
            {event.media.length > 1 && (
              <>
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
                  onClick={() => setCurrentMediaIndex((prev) => 
                    prev === 0 ? event.media.length - 1 : prev - 1
                  )}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
                  onClick={() => setCurrentMediaIndex((prev) => 
                    (prev + 1) % event.media.length
                  )}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <div className="absolute bottom-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-sm">
                  {currentMediaIndex + 1}/{event.media.length}
                </div>
              </>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
          <div>
            <h4 className="font-semibold text-sm text-gray-700">Document ID</h4>
            <p className="text-gray-600">{event.documentId}</p>
          </div>
          <div>
            <h4 className="font-semibold text-sm text-gray-700">Category</h4>
            <p className="text-gray-600">{event.category}</p>
          </div>
          <div>
            <h4 className="font-semibold text-sm text-gray-700">Event Type</h4>
            <p className="text-gray-600">{event.eventType}</p>
          </div>
          <div>
            <h4 className="font-semibold text-sm text-gray-700">Date</h4>
            <p className="text-gray-600">{event.startDate} - {event.endDate}</p>
          </div>
          <div>
            <h4 className="font-semibold text-sm text-gray-700">Department</h4>
            <p className="text-gray-600">{event.department}</p>
          </div>
          <div>
            <h4 className="font-semibold text-sm text-gray-700">Coordinator</h4>
            <p className="text-gray-600">{event.coordinator}</p>
          </div>
          <div>
            <h4 className="font-semibold text-sm text-gray-700">Team Members</h4>
            <p className="text-gray-600">{event.teamMembers}</p>
          </div>
          <div>
            <h4 className="font-semibold text-sm text-gray-700">Resource Persons</h4>
            <p className="text-gray-600">{event.resourcePersons}</p>
          </div>
          <div>
            <h4 className="font-semibold text-sm text-gray-700">Participants Count</h4>
            <p className="text-gray-600">{event.participantsCount}</p>
          </div>
          <div>
            <h4 className="font-semibold text-sm text-gray-700">External Participants</h4>
            <p className="text-gray-600">{event.externalParticipants}</p>
          </div>
          <div>
            <h4 className="font-semibold text-sm text-gray-700">Sponsored By</h4>
            <p className="text-gray-600">{event.sponsoredBy}</p>
          </div>
          <div>
            <h4 className="font-semibold text-sm text-gray-700">Financial Assistance</h4>
            <p className="text-gray-600">₹{event.financialAssistance}</p>
          </div>
          <div>
            <h4 className="font-semibold text-sm text-gray-700">Total Expenses</h4>
            <p className="text-gray-600">₹{event.totalExpenses}</p>
          </div>
        </div>

        <div className="p-4">
          <h4 className="font-semibold text-sm text-gray-700">Description</h4>
          <p className="text-gray-600 whitespace-pre-wrap">{event.description}</p>
        </div>

        <Button 
          onClick={() => generateEventPDF(event)}
          className="w-full mt-4"
        >
          Generate PDF Report
        </Button>
      </DialogContent>
    </Dialog>
  );
};