
import { useState } from 'react';
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Building2, Clock, Users, ArrowLeft } from "lucide-react";

interface CalendarViewProps {
  onBack: () => void;
}

const CalendarView = ({ onBack }: CalendarViewProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  // Mock drive data with dates
  const driveEvents = [
    {
      id: 1,
      date: new Date(2025, 0, 15), // January 15, 2025
      company: "Google Inc.",
      role: "Software Engineer",
      time: "10:00 AM",
      package: "₹25 LPA",
      applicants: 150
    },
    {
      id: 2,
      date: new Date(2025, 0, 22), // January 22, 2025
      company: "Microsoft",
      role: "Product Manager",
      time: "2:00 PM",
      package: "₹22 LPA",
      applicants: 120
    },
    {
      id: 3,
      date: new Date(2025, 0, 28), // January 28, 2025
      company: "Amazon",
      role: "SDE-1",
      time: "11:00 AM",
      package: "₹20 LPA",
      applicants: 200
    }
  ];

  // Get events for selected date
  const getEventsForDate = (date: Date) => {
    return driveEvents.filter(event => 
      event.date.toDateString() === date.toDateString()
    );
  };

  // Get dates that have events
  const getEventDates = () => {
    return driveEvents.map(event => event.date);
  };

  const selectedDateEvents = selectedDate ? getEventsForDate(selectedDate) : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to List
          </Button>
          <h2 className="text-2xl font-bold text-gray-900">Placement Drive Calendar</h2>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Calendar */}
        <Card>
          <CardHeader>
            <CardTitle>Select Date</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              modifiers={{
                eventDay: getEventDates()
              }}
              modifiersStyles={{
                eventDay: {
                  backgroundColor: '#e0e7ff',
                  color: '#3730a3',
                  fontWeight: 'bold'
                }
              }}
              className="rounded-md border"
            />
            <div className="mt-4 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-indigo-200 rounded"></div>
                <span>Days with placement drives</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Events for Selected Date */}
        <Card>
          <CardHeader>
            <CardTitle>
              {selectedDate ? (
                `Events on ${selectedDate.toDateString()}`
              ) : (
                "Select a date to view events"
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedDateEvents.length > 0 ? (
              <div className="space-y-4">
                {selectedDateEvents.map((event) => (
                  <Card key={event.id} className="border-l-4 border-l-purple-500">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-lg flex items-center">
                          <Building2 className="h-5 w-5 mr-2 text-purple-600" />
                          {event.company}
                        </h3>
                        <Badge variant="secondary" className="bg-green-100 text-green-700">
                          {event.package}
                        </Badge>
                      </div>
                      <p className="text-gray-600 mb-3">{event.role}</p>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4 text-gray-500" />
                          <span>{event.time}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Users className="h-4 w-4 text-gray-500" />
                          <span>{event.applicants} applicants</span>
                        </div>
                      </div>
                      <Button 
                        size="sm" 
                        className="mt-3 bg-purple-600 hover:bg-purple-700 w-full"
                      >
                        Apply Now
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No placement drives scheduled for this date</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Events Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Drives This Month</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            {driveEvents.map((event) => (
              <Card key={event.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">{event.company}</h4>
                    <Badge variant="outline">{event.package}</Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{event.role}</p>
                  <div className="text-xs text-gray-500 space-y-1">
                    <div className="flex items-center space-x-1">
                      <Clock className="h-3 w-3" />
                      <span>{event.date.toDateString()} at {event.time}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="h-3 w-3" />
                      <span>{event.applicants} applicants</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CalendarView;
