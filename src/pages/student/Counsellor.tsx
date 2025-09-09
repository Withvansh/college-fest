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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { counsellorAPI, ICounsellor, AppointmentBookingData } from '@/lib/api/counsellor';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

function Counsellor() {
  const [counsellors, setCounsellors] = useState<ICounsellor[]>([]);
  const [filteredCounsellors, setFilteredCounsellors] = useState<ICounsellor[]>([]);
  const [selectedCounsellor, setSelectedCounsellor] = useState<ICounsellor | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userDetails, setUserDetails] = useState({
    name: '',
    email: '',
    phone: '',
    notes: ''
  });
  
  // Filter states
  const [specializationFilter, setSpecializationFilter] = useState<string>('all');
  const [experienceFilter, setExperienceFilter] = useState<string>('all');
  const [locationFilter, setLocationFilter] = useState<string>('all');

  useEffect(() => {
    fetchCounsellors();
  }, []);

  useEffect(() => {
    filterCounsellors();
  }, [counsellors, specializationFilter, experienceFilter, locationFilter]);

  const fetchCounsellors = async () => {
    try {
      setLoading(true);
      const data = await counsellorAPI.getAllCounsellors();
      setCounsellors(data);
    } catch (error) {
      console.error('Error fetching counsellors:', error);
      toast.error('Failed to load counsellors');
    } finally {
      setLoading(false);
    }
  };

  const filterCounsellors = () => {
    let filtered = counsellors;

    // Filter by specialization
    if (specializationFilter !== 'all') {
      filtered = filtered.filter(counsellor => 
        counsellor.specialization === specializationFilter
      );
    }

    // Filter by experience
    if (experienceFilter !== 'all') {
      const experienceNum = parseInt(experienceFilter);
      filtered = filtered.filter(counsellor => 
        parseInt(counsellor.experience) >= experienceNum
      );
    }

    // Filter by location
    if (locationFilter !== 'all') {
      filtered = filtered.filter(counsellor => 
        counsellor.city === locationFilter
      );
    }

    setFilteredCounsellors(filtered);
  };

  const handleCounsellorSelect = async (counsellor: ICounsellor) => {
    setSelectedCounsellor(counsellor);
    setSelectedDate(null);
    setBookingSuccess(false);
  };

  const handleDateSelect = async (date: Date | null) => {
    if (!date || !selectedCounsellor) return;
    setSelectedDate(date);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setUserDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleBookAppointment = async () => {
    if (!selectedCounsellor || !selectedDate) return;

    try {
      setLoading(true);
      const bookingData: AppointmentBookingData = {
        counsellorId: selectedCounsellor._id,
        date: selectedDate,
        userDetails
      };

      await counsellorAPI.bookAppointment(bookingData);
      
      setBookingSuccess(true);
      toast.success('Appointment booked successfully!');
      
      // Reset form after 3 seconds
      setTimeout(() => {
        setSelectedCounsellor(null);
        setSelectedDate(null);
        setUserDetails({
          name: '',
          email: '',
          phone: '',
          notes: ''
        });
        setBookingSuccess(false);
      }, 3000);
      
    } catch (error) {
      console.error('Error booking appointment:', error);
      toast.error('Failed to book appointment');
    } finally {
      setLoading(false);
    }
  };

  const isDateAvailable = (date: Date) => {
    if (!selectedCounsellor) return false;
    
    return selectedCounsellor.availableDates.some(availableDate => {
      const available = new Date(availableDate);
      return (
        available.getDate() === date.getDate() &&
        available.getMonth() === date.getMonth() &&
        available.getFullYear() === date.getFullYear()
      );
    });
  };

  // Get unique specializations, cities, and experiences for filters
  const specializations = [...new Set(counsellors.map(c => c.specialization))];
  const cities = [...new Set(counsellors.map(c => c.city))];
  const experiences = [...new Set(counsellors.map(c => c.experience))].sort((a, b) => parseInt(a) - parseInt(b));

  if (loading && counsellors.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
         <Link
                        to="/student/dashboard"
                        className="flex items-center text-gray-600 hover:text-gray-900"
                      >
                        <ArrowLeft className="h-5 w-5 mr-2" />
                        Back to All Drives
                      </Link>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Our Counsellors</h1>
       <Link
                to="/student/dashboard"
                className="flex items-center text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back
              </Link>
      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div>
          <Label htmlFor="specialization-filter">Specialization</Label>
          <Select value={specializationFilter} onValueChange={setSpecializationFilter}>
            <SelectTrigger id="specialization-filter">
              <SelectValue placeholder="Select specialization" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Specializations</SelectItem>
              {specializations.map(spec => (
                <SelectItem key={spec} value={spec}>{spec}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="experience-filter">Minimum Experience</Label>
          <Select value={experienceFilter} onValueChange={setExperienceFilter}>
            <SelectTrigger id="experience-filter">
              <SelectValue placeholder="Select experience" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any Experience</SelectItem>
              {experiences.map(exp => (
                <SelectItem key={exp} value={exp}>{exp} years</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="location-filter">Location</Label>
          <Select value={locationFilter} onValueChange={setLocationFilter}>
            <SelectTrigger id="location-filter">
              <SelectValue placeholder="Select location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Locations</SelectItem>
              {cities.map(city => (
                <SelectItem key={city} value={city}>{city}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {filteredCounsellors.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600">No counsellors match your filters.</p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => {
              setSpecializationFilter('all');
              setExperienceFilter('all');
              setLocationFilter('all');
            }}
          >
            Clear Filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {filteredCounsellors.map(counsellor => (
            <Card 
              key={counsellor._id} 
              className="cursor-pointer transition-all hover:shadow-lg"
              onClick={() => handleCounsellorSelect(counsellor)}
            >
              <CardContent className="flex flex-col items-center p-6">
                <Avatar className="w-24 h-24 mb-4">
                  <AvatarImage 
                    src={counsellor.image || `https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80`} 
                    alt={counsellor.name} 
                  />
                  <AvatarFallback>{counsellor.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <h3 className="text-xl font-semibold mb-2">{counsellor.name}</h3>
                <Badge variant="secondary" className="mb-2">{counsellor.specialization}</Badge>
                <p className="text-sm text-gray-600 mb-1">{counsellor.experience} years of experience</p>
                <p className="text-sm text-gray-600">{counsellor.phone}</p>
                <p className="text-sm text-gray-600">{counsellor.email}</p>
                <p className="text-sm text-gray-600 mt-2">
                  {counsellor.city}, {counsellor.state}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

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
                Your appointment with {selectedCounsellor?.name} on {selectedDate?.toDateString()} has been confirmed.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Select Date</h3>
                <Calendar
                  mode="single"
                  selected={selectedDate || undefined}
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
                    <h3 className="text-lg font-semibold mb-4">Your Information</h3>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="name">Full Name *</Label>
                        <Input
                          id="name"
                          name="name"
                          value={userDetails.name}
                          onChange={handleInputChange}
                          placeholder="Enter your full name"
                          required
                          disabled={loading}
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={userDetails.email}
                          onChange={handleInputChange}
                          placeholder="Enter your email"
                          required
                          disabled={loading}
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone *</Label>
                        <Input
                          id="phone"
                          name="phone"
                          value={userDetails.phone}
                          onChange={handleInputChange}
                          placeholder="Enter your phone number"
                          required
                          disabled={loading}
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
                          disabled={loading}
                        />
                      </div>
                    </div>
                    
                    <Button 
                      className="w-full mt-6" 
                      size="lg"
                      onClick={handleBookAppointment}
                      disabled={loading || !userDetails.name || !userDetails.email || !userDetails.phone}
                    >
                      {loading ? 'Booking...' : 'Confirm Appointment'}
                    </Button>
                  </>
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