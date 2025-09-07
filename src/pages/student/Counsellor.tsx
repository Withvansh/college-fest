import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

// Mock data for counsellors (in a real app, this would come from an API)
const mockCounsellors = [
  {
    _id: '1',
    name: 'Dr. Sarah Johnson',
    email: 's.johnson@example.com',
    phone: '+1 (555) 123-4567',
    experience: '8 years',
    specialization: 'Relationship Counseling',
    availableDates: [
      new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // Tomorrow
      new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // Day after tomorrow
      new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // In 5 days
      new Date(Date.now() + 6 * 24 * 60 * 60 * 1000), // In 6 days
    ],
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80'
  },
  {
    _id: '2',
    name: 'Dr. Michael Chen',
    email: 'm.chen@example.com',
    phone: '+1 (555) 987-6543',
    experience: '12 years',
    specialization: 'Career Counseling',
    availableDates: [
      new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
      new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    ],
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80'
  },
  {
    _id: '3',
    name: 'Dr. Priya Sharma',
    email: 'p.sharma@example.com',
    phone: '+1 (555) 456-7890',
    experience: '6 years',
    specialization: 'Stress Management',
    availableDates: [
      new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
      new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
      new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      new Date(Date.now() + 8 * 24 * 60 * 60 * 1000),
    ],
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80'
  }
];

function Counsellor() {
  const [counsellors, setCounsellors] = useState([]);
  const [selectedCounsellor, setSelectedCounsellor] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [userDetails, setUserDetails] = useState({
    name: '',
    email: '',
    phone: '',
    notes: ''
  });

  useEffect(() => {
    // Simulate API fetch
    setCounsellors(mockCounsellors);
  }, []);

  const handleCounsellorSelect = (counsellor) => {
    setSelectedCounsellor(counsellor);
    setSelectedDate(null);
    setSelectedSlot(null);
    setBookingSuccess(false);
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setSelectedSlot(null);
  };

  const handleSlotSelect = (slot) => {
    setSelectedSlot(slot);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleBookAppointment = () => {
    // In a real app, this would make an API call to book the appointment
    console.log('Booking details:', {
      counsellor: selectedCounsellor,
      date: selectedDate,
      slot: selectedSlot,
      userDetails
    });
    
    // Simulate successful booking
    setBookingSuccess(true);
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setSelectedCounsellor(null);
      setSelectedDate(null);
      setSelectedSlot(null);
      setUserDetails({
        name: '',
        email: '',
        phone: '',
        notes: ''
      });
      setBookingSuccess(false);
    }, 3000);
  };

  const isDateAvailable = (date) => {
    if (!selectedCounsellor) return false;
    
    return selectedCounsellor.availableDates.some(availableDate => 
      availableDate.getDate() === date.getDate() &&
      availableDate.getMonth() === date.getMonth() &&
      availableDate.getFullYear() === date.getFullYear()
    );
  };

  const timeSlots = [
    '9:00 AM', '10:00 AM', '11:00 AM', 
    '12:00 PM', '1:00 PM', '2:00 PM', 
    '3:00 PM', '4:00 PM', '5:00 PM'
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Our Counsellors</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {counsellors.map(counsellor => (
          <Card 
            key={counsellor._id} 
            className="cursor-pointer transition-all hover:shadow-lg"
            onClick={() => handleCounsellorSelect(counsellor)}
          >
            <CardContent className="flex flex-col items-center p-6">
              <Avatar className="w-24 h-24 mb-4">
                <AvatarImage src={counsellor.image} alt={counsellor.name} />
                <AvatarFallback>{counsellor.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <h3 className="text-xl font-semibold mb-2">{counsellor.name}</h3>
              <Badge variant="secondary" className="mb-2">{counsellor.specialization}</Badge>
              <p className="text-sm text-gray-600 mb-1">{counsellor.experience} of experience</p>
              <p className="text-sm text-gray-600">{counsellor.phone}</p>
              <p className="text-sm text-gray-600">{counsellor.email}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={!!selectedCounsellor} onOpenChange={() => setSelectedCounsellor(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              Book Appointment with {selectedCounsellor?.name}
            </DialogTitle>
          </DialogHeader>
          
          {bookingSuccess ? (
            <div className="text-center py-8">
              <div className="text-green-500 text-5xl mb-4">✓</div>
              <h3 className="text-xl font-semibold mb-2">Appointment Booked Successfully!</h3>
              <p className="text-gray-600">
                Your appointment with {selectedCounsellor?.name} on {selectedDate?.toDateString()} at {selectedSlot} has been confirmed.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Select Date</h3>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={handleDateSelect}
                  disabled={(date) => 
                    date < new Date() || !isDateAvailable(date)
                  }
                  className="rounded-md border"
                />
              </div>
              
              <div>
                {selectedDate && (
                  <>
                    <h3 className="text-lg font-semibold mb-4">Select Time Slot</h3>
                    <div className="grid grid-cols-3 gap-2 mb-6">
                      {timeSlots.map(slot => (
                        <Button
                          key={slot}
                          variant={selectedSlot === slot ? "default" : "outline"}
                          onClick={() => handleSlotSelect(slot)}
                          className="h-10"
                        >
                          {slot}
                        </Button>
                      ))}
                    </div>
                  </>
                )}
                
                {selectedSlot && (
                  <>
                    <h3 className="text-lg font-semibold mb-4">Your Information</h3>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          name="name"
                          value={userDetails.name}
                          onChange={handleInputChange}
                          placeholder="Enter your full name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={userDetails.email}
                          onChange={handleInputChange}
                          placeholder="Enter your email"
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          name="phone"
                          value={userDetails.phone}
                          onChange={handleInputChange}
                          placeholder="Enter your phone number"
                        />
                      </div>
                      <div>
                        <Label htmlFor="notes">Notes (Optional)</Label>
                        <Textarea
                          id="notes"
                          name="notes"
                          value={userDetails.notes}
                          onChange={handleInputChange}
                          placeholder="Any specific concerns or questions you'd like to discuss"
                          rows={3}
                        />
                      </div>
                    </div>
                  </>
                )}
                
                {selectedSlot && (
                  <Button 
                    className="w-full mt-6" 
                    size="lg"
                    onClick={handleBookAppointment}
                  >
                    Confirm Appointment
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default Counsellor;