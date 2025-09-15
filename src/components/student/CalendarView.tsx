import { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Building2, Clock, Users, ArrowLeft } from 'lucide-react';
import { PlacementDrive } from '@/lib/api/student';

interface CalendarViewProps {
  onBack: () => void;
  drives: PlacementDrive[];
}

const CalendarView = ({ onBack, drives }: CalendarViewProps) => {
  const driveEvents = drives || [];

  // Show loading state if no drives data yet
  if (!drives || drives.length === 0) {
    return (
      <div className="space-y-3 sm:space-y-4 lg:space-y-6 p-3 sm:p-4 lg:p-6 max-h-[70vh] overflow-y-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
          <div className="flex items-center space-x-2 sm:space-x-3 lg:space-x-4">
            <Button
              variant="outline"
              onClick={onBack}
              size="sm"
              className="flex-shrink-0 h-8 sm:h-9"
            >
              <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              Back to List
            </Button>
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
              Placement Drive Calendar
            </h2>
          </div>
        </div>

        <div className="text-center py-8 sm:py-10 lg:py-12">
          <Building2 className="h-12 w-12 sm:h-14 sm:w-14 lg:h-16 lg:w-16 text-gray-400 mx-auto mb-3 sm:mb-4" />
          <p className="text-gray-500 text-sm sm:text-base lg:text-lg">
            No placement drives available
          </p>
          <p className="text-gray-400 text-xs sm:text-sm mt-1 sm:mt-2">
            Check back later for upcoming opportunities
          </p>
        </div>
      </div>
    );
  }

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(() => {
    const today = new Date();
    const upcomingEvents = driveEvents.filter(event => new Date(event.drive_date) >= today);
    return upcomingEvents.length > 0 ? new Date(upcomingEvents[0].drive_date) : today;
  });

  // Get events for selected date
  const getEventsForDate = (date: Date) => {
    return driveEvents.filter(
      event => new Date(event.drive_date).toDateString() === date.toDateString()
    );
  };

  // Get dates that have events
  const getEventDates = () => {
    return driveEvents.map(event => new Date(event.drive_date));
  };

  const selectedDateEvents = selectedDate ? getEventsForDate(selectedDate) : [];

  // Get upcoming events count
  const upcomingEventsCount = driveEvents.filter(
    event => new Date(event.drive_date) >= new Date()
  ).length;

  return (
    <div className="space-y-3 sm:space-y-4 lg:space-y-6 p-3 sm:p-4 lg:p-6 max-h-[70vh] overflow-y-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
        <div className="flex items-center space-x-2 sm:space-x-3 lg:space-x-4">
          <Button variant="outline" onClick={onBack} size="sm" className="flex-shrink-0 h-8 sm:h-9">
            <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            Back to List
          </Button>
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
            Placement Drive Calendar
            <span className="ml-1 sm:ml-2 text-xs sm:text-sm font-normal text-gray-500">
              ({driveEvents.length} drives)
            </span>
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
        {/* Calendar */}
        <Card>
          <CardHeader className="pb-2 sm:pb-3">
            <CardTitle className="text-base sm:text-lg lg:text-xl">Select Date</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              modifiers={{
                eventDay: getEventDates(),
              }}
              modifiersStyles={{
                eventDay: {
                  backgroundColor: '#e0e7ff',
                  color: '#3730a3',
                  fontWeight: 'bold',
                  borderRadius: '4px',
                },
              }}
              className="rounded-md border w-full hover:shadow-md transition-shadow text-sm"
            />
            <div className="mt-3 sm:mt-4 text-xs sm:text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 sm:w-3 sm:h-3 lg:w-4 lg:h-4 bg-indigo-200 rounded flex-shrink-0"></div>
                <span>Days with placement drives</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Events for Selected Date */}
        <Card>
          <CardHeader className="pb-2 sm:pb-3">
            <CardTitle className="text-base sm:text-lg lg:text-xl">
              {selectedDate
                ? `Events on ${selectedDate.toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric',
                  })}`
                : 'Select a date to view events'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedDateEvents.length > 0 ? (
              <div className="space-y-2 sm:space-y-3 lg:space-y-4">
                {selectedDateEvents.map(event => (
                  <Card
                    key={event._id}
                    className="border-l-4 border-l-purple-500 hover:shadow-md transition-shadow"
                  >
                    <CardContent className="p-3 sm:p-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 gap-1 sm:gap-2">
                        <h3 className="font-semibold text-sm sm:text-base lg:text-lg flex items-center">
                          <Building2 className="h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5 mr-1 sm:mr-2 text-purple-600 flex-shrink-0" />
                          <span className="truncate">{event.company}</span>
                        </h3>
                        <Badge
                          variant="secondary"
                          className="bg-green-100 text-green-700 text-xs sm:text-sm w-fit self-start sm:self-auto"
                        >
                          {event.salary_package || 'Not disclosed'}
                        </Badge>
                      </div>
                      <p className="text-gray-600 mb-2 sm:mb-3 text-xs sm:text-sm lg:text-base">
                        {event.role}
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 lg:gap-4 text-xs sm:text-sm">
                        <div className="flex items-center space-x-1 sm:space-x-2">
                          <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500 flex-shrink-0" />
                          <span>{event.drive_time}</span>
                        </div>
                        <div className="flex items-center space-x-1 sm:space-x-2">
                          <Users className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500 flex-shrink-0" />
                          <span>{event.positions_available} positions</span>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        className="mt-2 sm:mt-3 bg-purple-600 hover:bg-purple-700 w-full text-xs sm:text-sm h-8 sm:h-9"
                      >
                        Apply Now
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 sm:py-6 lg:py-8">
                <Building2 className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 text-gray-400 mx-auto mb-2 sm:mb-3 lg:mb-4" />
                <p className="text-gray-500 text-xs sm:text-sm lg:text-base">
                  No placement drives scheduled for this date
                </p>
                <p className="text-xs text-gray-400 mt-1 sm:mt-2">Try selecting a different date</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Events Summary */}
      <Card>
        <CardHeader className="pb-2 sm:pb-3">
          <CardTitle className="text-base sm:text-lg lg:text-xl">All Available Drives</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 lg:gap-4">
            {driveEvents.map(event => (
              <Card
                key={event._id}
                className="hover:shadow-md transition-shadow border hover:border-purple-200"
              >
                <CardContent className="p-2 sm:p-3 lg:p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-1 sm:mb-2 gap-1 sm:gap-2">
                    <h4 className="font-semibold text-xs sm:text-sm lg:text-base truncate">
                      {event.company}
                    </h4>
                    <Badge variant="outline" className="text-xs w-fit self-start sm:self-auto">
                      {event.salary_package || 'Not disclosed'}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-600 mb-1 sm:mb-2 truncate">{event.role}</p>
                  <div className="text-xs text-gray-500 space-y-0.5 sm:space-y-1">
                    <div className="flex items-center space-x-1">
                      <Clock className="h-2 w-2 sm:h-3 sm:w-3 flex-shrink-0" />
                      <span className="truncate text-xs">
                        {new Date(event.drive_date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })}{' '}
                        at {event.drive_time}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="h-2 w-2 sm:h-3 sm:w-3 flex-shrink-0" />
                      <span className="text-xs">{event.positions_available} positions</span>
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
