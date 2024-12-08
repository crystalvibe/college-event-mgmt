import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { EVENT_CATEGORIES } from "@/constants/eventCategories";
import { useEvents } from "@/contexts/EventContext";
import { ArrowRight } from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate();
  const { events } = useEvents();
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    // Get all unique categories from both EVENT_CATEGORIES and existing events
    const eventCategories = events.map(event => event.category);
    const storedCategories = JSON.parse(localStorage.getItem("eventCategories") || "[]");
    const allCategories = Array.from(new Set([
      ...EVENT_CATEGORIES,
      ...storedCategories,
      ...eventCategories
    ])).filter(category => category !== "Other" && category !== "");

    setCategories(allCategories);
  }, [events]); // Add events as a dependency to update when events change

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-slate-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
          <Button 
            onClick={() => navigate("/events")} 
            className="bg-red-600 hover:bg-red-700 text-white rounded-full px-6 py-2 
                      flex items-center gap-2"
          >
            Back
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="transform transition-all duration-300 hover:scale-105 
                         shadow-[0_4px_12px_rgba(220,38,38,0.15)] hover:shadow-[0_8px_24px_rgba(220,38,38,0.25)] 
                         bg-white/90 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-800">
                Total Events
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-red-600">{events.length}</p>
            </CardContent>
          </Card>
          
          {categories.map(category => (
            <Card 
              key={category}
              className="transform transition-all duration-300 hover:scale-105 
                         shadow-[0_4px_12px_rgba(220,38,38,0.15)] hover:shadow-[0_8px_24px_rgba(220,38,38,0.25)] 
                         bg-white/90 backdrop-blur"
            >
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-800">
                  {category} Events
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-red-600">
                  {events.filter((e: any) => e.category === category).length}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}