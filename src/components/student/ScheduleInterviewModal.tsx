import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar as CalendarIcon, Clock, Video, MapPin, X, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ScheduleInterviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  companyName: string;
}

const ScheduleInterviewModal = ({ isOpen, onClose, companyName }: ScheduleInterviewModalProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [interviewType, setInterviewType] = useState<string>('video');
  const [isScheduling, setIsScheduling] = useState(false);

  const timeSlots = [
    { time: '09:00 AM', available: true },
    { time: '10:00 AM', available: true },
    { time: '11:00 AM', available: false },
    { time: '12:00 PM', available: true },
    { time: '02:00 PM', available: true },
    { time: '03:00 PM', available: true },
    { time: '04:00 PM', available: false },
    { time: '05:00 PM', available: true },
  ];

  const handleSchedule = async () => {
    if (!selectedDate || !selectedTime) {
      toast.error('Please select both date and time');
      return;
    }

    setIsScheduling(true);

    try {
      // Simulate API call with realistic delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Show success message
      toast.success(`Interview scheduled successfully with ${companyName}!`, {
        description: `${selectedDate.toDateString()} at ${selectedTime} - ${interviewType === 'video' ? 'Online Interview' : 'Office Visit'}`,
      });

      // Reset form and close modal
      setSelectedDate(new Date());
      setSelectedTime('');
      setInterviewType('video');
      onClose();
    } catch (error) {
      toast.error('Failed to schedule interview. Please try again.');
    } finally {
      setIsScheduling(false);
    }
  };

  const isFormValid = selectedDate && selectedTime;

  const handleTimeSlotSelect = (time: string, available: boolean) => {
    if (available) {
      setSelectedTime(time);
    }
  };

  const handleClose = () => {
    if (!isScheduling) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0 overflow-hidden mx-4">
        {/* Sticky Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 z-10">
          <DialogHeader className="p-4 sm:p-6 pb-3 sm:pb-4">
            <div className="flex items-center justify-between">
              <DialogTitle className="flex items-center text-lg sm:text-xl font-semibold">
                <CalendarIcon className="h-5 w-5 sm:h-6 sm:w-6 mr-2 sm:mr-3 text-purple-600" />
                <span className="truncate">Schedule Interview - {companyName}</span>
              </DialogTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClose}
                className="h-8 w-8 p-0 flex-shrink-0"
                disabled={isScheduling}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>

          {/* Interview Type Toggle */}
          <div className="px-6 pb-4">
            <div className="flex space-x-2 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => !isScheduling && setInterviewType('video')}
                disabled={isScheduling}
                className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-md transition-all duration-200 ${
                  interviewType === 'video'
                    ? 'bg-white shadow-sm text-purple-600 font-medium'
                    : 'text-gray-600 hover:text-gray-800'
                } ${isScheduling ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <Video className="h-4 w-4" />
                <span>Online Interview</span>
              </button>
              <button
                onClick={() => !isScheduling && setInterviewType('onsite')}
                disabled={isScheduling}
                className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-md transition-all duration-200 ${
                  interviewType === 'onsite'
                    ? 'bg-white shadow-sm text-purple-600 font-medium'
                    : 'text-gray-600 hover:text-gray-800'
                } ${isScheduling ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <MapPin className="h-4 w-4" />
                <span>Office Visit</span>
              </button>
            </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <ScrollArea className="flex-1 px-6">
          <div className="space-y-6 pb-6">
            {/* Date Selection */}
            <Card className="shadow-sm border-gray-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center">
                  <CalendarIcon className="h-5 w-5 mr-2 text-purple-600" />
                  Select Date
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={date => !isScheduling && setSelectedDate(date)}
                    disabled={date =>
                      isScheduling ||
                      date < new Date() ||
                      date.getDay() === 0 ||
                      date.getDay() === 6
                    }
                    className="rounded-md border-0 pointer-events-auto"
                    classNames={{
                      day_selected: 'bg-purple-600 text-white hover:bg-purple-700',
                      day_today: 'bg-purple-100 text-purple-900 font-semibold',
                    }}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Time Selection */}
            <Card className="shadow-sm border-gray-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-purple-600" />
                  Available Time Slots
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* Mobile: Horizontal Scroll */}
                <div className="md:hidden">
                  <ScrollArea className="w-full">
                    <div className="flex space-x-3 pb-4">
                      {timeSlots.map(slot => (
                        <button
                          key={slot.time}
                          onClick={() => handleTimeSlotSelect(slot.time, slot.available)}
                          disabled={!slot.available || isScheduling}
                          className={`min-w-[120px] p-3 border rounded-lg text-center transition-all duration-200 font-medium ${
                            selectedTime === slot.time
                              ? 'border-purple-500 bg-purple-600 text-white shadow-md transform scale-105'
                              : slot.available && !isScheduling
                                ? 'border-gray-200 hover:border-purple-300 hover:bg-purple-50/50'
                                : 'border-gray-100 bg-gray-50 text-gray-400 cursor-not-allowed'
                          }`}
                        >
                          <div className="text-sm">{slot.time}</div>
                          {!slot.available && (
                            <div className="text-xs text-red-500 mt-1">Booked</div>
                          )}
                        </button>
                      ))}
                    </div>
                  </ScrollArea>
                </div>

                {/* Desktop: Grid */}
                <div className="hidden md:grid grid-cols-4 gap-3">
                  {timeSlots.map(slot => (
                    <button
                      key={slot.time}
                      onClick={() => handleTimeSlotSelect(slot.time, slot.available)}
                      disabled={!slot.available || isScheduling}
                      className={`p-4 border rounded-lg text-center transition-all duration-200 font-medium ${
                        selectedTime === slot.time
                          ? 'border-purple-500 bg-purple-600 text-white shadow-md transform scale-105'
                          : slot.available && !isScheduling
                            ? 'border-gray-200 hover:border-purple-300 hover:bg-purple-50/50 hover:shadow-sm'
                            : 'border-gray-100 bg-gray-50 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      <div>{slot.time}</div>
                      {!slot.available && <div className="text-xs text-red-500 mt-1">Booked</div>}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Summary Card */}
            {isFormValid && (
              <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200 shadow-sm animate-fade-in">
                <CardContent className="p-4">
                  <h4 className="font-semibold text-purple-900 mb-3 flex items-center">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Interview Summary
                  </h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Company:</span>
                      <p className="font-medium text-gray-900">{companyName}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Date:</span>
                      <p className="font-medium text-gray-900">{selectedDate?.toDateString()}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Time:</span>
                      <p className="font-medium text-gray-900">{selectedTime}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Type:</span>
                      <p className="font-medium text-gray-900">
                        {interviewType === 'video' ? 'Online Interview' : 'Office Visit'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </ScrollArea>

        {/* Sticky Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6">
          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={isScheduling}
              className="flex-1 sm:flex-none"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSchedule}
              disabled={!isFormValid || isScheduling}
              className={`flex-1 sm:flex-none transition-all duration-200 ${
                isFormValid && !isScheduling
                  ? 'bg-purple-600 hover:bg-purple-700 shadow-lg hover:shadow-xl hover:scale-105'
                  : 'bg-gray-300 cursor-not-allowed opacity-50'
              }`}
            >
              {isScheduling ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Scheduling...
                </>
              ) : (
                <>
                  <CalendarIcon className="h-4 w-4 mr-2" />
                  Confirm Interview Slot
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ScheduleInterviewModal;
