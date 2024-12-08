import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useEvents } from "@/contexts/EventContext";
import { generateAllEventsPDF, generateEventPDF } from "@/utils/pdfGenerator";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Event as CustomEvent } from "@/types/event";
import { toast } from "@/components/ui/use-toast";

export default function Report() {
  const navigate = useNavigate();
  const { events } = useEvents();
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [coordinator, setCoordinator] = useState("");
  const [venue, setVenue] = useState("");
  const [department, setDepartment] = useState("");
  const [filteredEvents, setFilteredEvents] = useState<CustomEvent[]>([]);

  useEffect(() => {
    console.log('Events from context:', events);
    setFilteredEvents(events);
  }, [events]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return "Invalid Date";
    }
    return date.toLocaleDateString();
  };

  const handleFilter = () => {
    console.log('Filtering events. Current events:', events);
    let filtered = [...events];

    if (startDate || endDate) {
      filtered = filtered.filter((event) => {
        try {
          // Parse dates and ensure they're valid
          const eventStartDate = new Date(event.date);
          const eventEndDate = event.endDate ? new Date(event.endDate) : eventStartDate;

          // Convert filter dates to start of day
          const filterStartDate = startDate ? new Date(startDate) : null;
          const filterEndDate = endDate ? new Date(endDate) : null;

          // Set all dates to start of day for comparison
          if (filterStartDate) filterStartDate.setHours(0, 0, 0, 0);
          if (filterEndDate) filterEndDate.setHours(0, 0, 0, 0);
          eventStartDate.setHours(0, 0, 0, 0);
          eventEndDate.setHours(0, 0, 0, 0);

          // For debugging
          console.log({
            event: event.title,
            eventStart: eventStartDate.toISOString(),
            eventEnd: eventEndDate.toISOString(),
            filterStart: filterStartDate?.toISOString(),
            filterEnd: filterEndDate?.toISOString()
          });

          // Only start date is selected
          if (filterStartDate && !filterEndDate) {
            return eventStartDate >= filterStartDate;
          }

          // Only end date is selected
          if (!filterStartDate && filterEndDate) {
            return eventStartDate <= filterEndDate;
          }

          // Both dates are selected
          if (filterStartDate && filterEndDate) {
            return eventStartDate >= filterStartDate && eventStartDate <= filterEndDate;
          }

          return true;
        } catch (error) {
          console.error('Date filtering error for event:', event.title, error);
          return false;
        }
      });
    }

    if (coordinator.trim()) {
      filtered = filtered.filter((event) => 
        event.coordinator.toLowerCase().includes(coordinator.toLowerCase().trim())
      );
    }

    if (venue.trim()) {
      filtered = filtered.filter((event) => 
        event.venue?.toLowerCase().includes(venue.toLowerCase().trim())
      );
    }

    if (department.trim()) {
      filtered = filtered.filter((event) => 
        event.department?.toLowerCase().includes(department.toLowerCase().trim())
      );
    }

    console.log('Filtered events:', filtered);
    setFilteredEvents(filtered.length > 0 ? filtered : []);
  };

  const resetFilters = () => {
    setStartDate(undefined);
    setEndDate(undefined);
    setCoordinator("");
    setVenue("");
    setDepartment("");
    setFilteredEvents(events);
  };

  const handleGenerateReport = async (eventId: number) => {
    try {
      const event = events.find((e) => e.id === eventId);
      if (!event) {
        toast({
          title: "Error",
          description: "Event not found",
          variant: "destructive"
        });
        return;
      }

      await generateEventPDF(event);
      toast({
        title: "Success",
        description: "Report generated successfully",
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        title: "Error",
        description: "Failed to generate report. Please check console for details.",
        variant: "destructive"
      });
    }
  };

  const handleGenerateAllReports = async () => {
    try {
      if (filteredEvents.length === 0) {
        toast({
          title: "Error",
          description: "No events to generate report from",
          variant: "destructive"
        });
        return;
      }

      await generateAllEventsPDF(filteredEvents);
      toast({
        title: "Success",
        description: "All reports generated successfully",
      });
    } catch (error) {
      console.error('Error generating PDFs:', error);
      toast({
        title: "Error",
        description: "Failed to generate reports. Please check console for details.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-slate-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Generate Reports</h1>
          <div className="space-x-4">
            <Button
              onClick={handleGenerateAllReports}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Generate All Reports
            </Button>
            <Button
              onClick={() => navigate("/events")}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Back to Events
            </Button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Start Date</label>
              <Calendar
                mode="single"
                selected={startDate}
                onSelect={setStartDate}
                className="rounded-md border"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">End Date</label>
              <Calendar
                mode="single"
                selected={endDate}
                onSelect={setEndDate}
                className="rounded-md border"
              />
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Coordinator Name
                </label>
                <Input
                  type="text"
                  value={coordinator}
                  onChange={(e) => setCoordinator(e.target.value)}
                  placeholder="Enter coordinator name"
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Venue
                </label>
                <Input
                  type="text"
                  value={venue}
                  onChange={(e) => setVenue(e.target.value)}
                  placeholder="Enter venue"
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Department
                </label>
                <Input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  placeholder="Enter department"
                  className="w-full"
                />
              </div>
              <Button
                onClick={handleFilter}
                className="bg-red-600 hover:bg-red-700 text-white w-full"
              >
                Apply Filters
              </Button>
              <Button
                onClick={resetFilters}
                className="bg-gray-600 hover:bg-gray-700 text-white w-full"
              >
                Reset Filters
              </Button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Event Name</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
                <TableHead>Venue</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Coordinator</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEvents.map((event) => (
                <TableRow key={event.id}>
                  <TableCell>{event.title}</TableCell>
                  <TableCell>{new Date(event.date).toLocaleDateString()}</TableCell>
                  <TableCell>
                    {event.endDate ? new Date(event.endDate).toLocaleDateString() : '-'}
                  </TableCell>
                  <TableCell>{event.venue || '-'}</TableCell>
                  <TableCell>{event.department || '-'}</TableCell>
                  <TableCell>{event.coordinator}</TableCell>
                  <TableCell>
                    <Button
                      onClick={() => handleGenerateReport(event.id)}
                      className="bg-red-600 hover:bg-red-700 text-white"
                    >
                      Generate Report
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {filteredEvents.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-4">
                    No events found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
} 