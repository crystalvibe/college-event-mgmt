import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileIcon, Calendar, Edit2, Trash2, Eye, FileAudio, FileText, MapPin } from "lucide-react";
import { useEffect, useState } from "react";

interface EventCardProps {
  event: any;
  onView: (event: any) => void;
  onEdit: (event: any) => void;
  onDelete: (id: number) => void;
}

export const EventCard = ({ event, onEdit, onDelete, onView }: EventCardProps) => {
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);

  useEffect(() => {
    if (event.media && event.media.length > 1) {
      const interval = setInterval(() => {
        setCurrentMediaIndex((prev) => (prev + 1) % event.media.length);
      }, 5000); // Change slide every 5 seconds
      return () => clearInterval(interval);
    }
  }, [event.media]);

  const getMediaPreview = () => {
    if (!event.media || event.media.length === 0) {
      return null;
    }

    const firstMedia = event.media[currentMediaIndex];
    
    if (firstMedia.type.startsWith('image/')) {
      return (
        <div className="relative w-full h-48">
          <img
            src={firstMedia.data}
            alt="Event media"
            className="w-full h-48 object-cover rounded-t-lg"
          />
          {event.media.length > 1 && (
            <div className="absolute bottom-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-sm">
              {currentMediaIndex + 1}/{event.media.length}
            </div>
          )}
        </div>
      );
    } else if (firstMedia.type.startsWith('video/')) {
      return (
        <video
          src={firstMedia.data}
          className="w-full h-48 object-cover rounded-t-lg"
          autoPlay
          muted
          loop
          playsInline
        />
      );
    } else if (firstMedia.type.startsWith('audio/')) {
      return (
        <div className="w-full h-24 bg-gray-100 rounded-t-lg flex items-center justify-center p-4">
          <FileAudio className="w-12 h-12 text-gray-400 mb-2" />
          <audio src={firstMedia.data} controls className="w-full" />
        </div>
      );
    } else if (firstMedia.type === 'application/pdf') {
      return (
        <div className="w-full h-48 bg-gray-100 rounded-t-lg flex flex-col items-center justify-center">
          <FileText className="w-12 h-12 text-red-400 mb-2" />
          <span className="text-sm text-gray-600">PDF Document</span>
        </div>
      );
    } else {
      return (
        <div className="w-full h-48 bg-gray-100 rounded-t-lg flex flex-col items-center justify-center">
          <FileIcon className="w-12 h-12 text-gray-400 mb-2" />
          <span className="text-sm text-gray-600">{firstMedia.name}</span>
        </div>
      );
    }
  };

  return (
    <Card className="overflow-hidden bg-white 
                    transition-shadow duration-300
                    shadow-[0_4px_12px_rgba(220,38,38,0.15)] 
                    hover:shadow-[0_8px_24px_rgba(220,38,38,0.25)]">
      {getMediaPreview()}
      <CardHeader className="space-y-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl font-bold">{event.title}</CardTitle>
          <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm">
            {event.category}
          </span>
        </div>
        <div className="flex items-center text-sm text-gray-500 space-x-2">
          <Calendar className="w-4 h-4" />
          <span>
            {new Date(event.date).toLocaleDateString()}
            {event.endDate && ` - ${new Date(event.endDate).toLocaleDateString()}`}
          </span>
        </div>
        <div className="flex items-center text-sm text-gray-500 space-x-2">
          <MapPin className="w-4 h-4" />
          <span>{event.department || 'No location'}</span>
        </div>
        <p className="text-sm text-gray-600">Type: {event.eventType}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm text-gray-600 line-clamp-2">{event.description}</p>
        </div>
        
        <div className="flex justify-end items-center space-x-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onView(event)}
            className="flex items-center space-x-1"
          >
            <Eye className="w-4 h-4" />
            <span>View</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(event)}
            className="flex items-center space-x-1"
          >
            <Edit2 className="w-4 h-4" />
            <span>Edit</span>
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => onDelete(event.id)}
            className="flex items-center space-x-1"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};