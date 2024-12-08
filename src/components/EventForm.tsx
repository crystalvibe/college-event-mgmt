import { Button } from "@/components/ui/button";
import { useState } from "react";
import { BasicEventDetails } from "./event-form/BasicEventDetails";
import { DateAndDepartment } from "./event-form/DateAndDepartment";
import { TeamDetails } from "./event-form/TeamDetails";
import { ParticipantsAndFinance } from "./event-form/ParticipantsAndFinance";
import { MediaUpload } from "./event-form/MediaUpload";

interface EventFormProps {
  onSubmit: (eventData: any) => void;
  initialData?: any;
  mode: "add" | "edit";
}

export function EventForm({ onSubmit, initialData, mode }: EventFormProps) {
  const [category, setCategory] = useState(initialData?.category || "");
  const [eventType, setEventType] = useState(initialData?.eventType || "");
  const [customCategory, setCustomCategory] = useState("");
  const [customEventType, setCustomEventType] = useState("");
  const [formData, setFormData] = useState({
    documentId: initialData?.documentId || `D${Math.floor(Math.random() * 100)}-${new Date().getFullYear()}`,
    title: initialData?.title || "",
    category: initialData?.category || "",
    eventType: initialData?.eventType || "",
    date: initialData?.date || "",
    endDate: initialData?.endDate || "",
    department: initialData?.department || "",
    coordinator: initialData?.coordinator || "",
    teamMembers: initialData?.teamMembers || "",
    resourcePersons: initialData?.resourcePersons || "",
    participantsCount: initialData?.participantsCount || "",
    externalParticipants: initialData?.externalParticipants || "",
    sponsoredBy: initialData?.sponsoredBy || "",
    financialAssistance: initialData?.financialAssistance || "",
    totalExpenses: initialData?.totalExpenses || "",
    description: initialData?.description || "",
    media: initialData?.media || []
  });

  const handleSubmit = () => {
    if (!formData.title || !formData.category || !formData.date) {
      return;
    }
    
    const finalCategory = category === "Other" ? customCategory : category;
    const finalEventType = eventType === "Other" ? customEventType : eventType;
    
    const formattedDate = new Date(formData.date).toISOString();
    
    onSubmit({
      ...formData,
      title: formData.title.trim(),
      date: formattedDate,
      category: finalCategory,
      eventType: finalEventType,
      coordinator: formData.coordinator.trim()
    });
  };

  return (
    <div className="space-y-6 max-h-[70vh] overflow-y-auto px-1">
      <BasicEventDetails
        formData={formData}
        setFormData={setFormData}
        category={category}
        setCategory={setCategory}
        eventType={eventType}
        setEventType={setEventType}
        customCategory={customCategory}
        setCustomCategory={setCustomCategory}
        customEventType={customEventType}
        setCustomEventType={setCustomEventType}
      />
      
      <DateAndDepartment
        formData={formData}
        setFormData={setFormData}
      />
      
      <TeamDetails
        formData={formData}
        setFormData={setFormData}
      />
      
      <ParticipantsAndFinance
        formData={formData}
        setFormData={setFormData}
      />

      <MediaUpload
        formData={formData}
        setFormData={setFormData}
      />

      <Button onClick={handleSubmit} className="w-full">
        {mode === "add" ? "Add Event" : "Save Changes"}
      </Button>
    </div>
  );
}