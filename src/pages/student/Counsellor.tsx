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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { counsellorAPI, ICounsellor } from '@/lib/api/counsellor';
import { counsellorBookingAPI, BookingCreateData } from '@/lib/api/CounsellorBooking';
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
    notes: '',
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
  }, [specializationFilter, experienceFilter, locationFilter, counsellors]); // Added counsellors as dependency

  const fetchCounsellors = async () => {
    try {
      setLoading(true);
      const data = await counsellorAPI.getAllCounsellors();
      setCounsellors(data);
      setFilteredCounsellors(data); // Initialize filtered counsellors
    } catch (error) {
      console.error('Error fetching counsellors:', error);
      toast.error('Failed to load counsellors');
    } finally {
      setLoading(false);
    }
  };

  const filterCounsellors = () => {
    if (!counsellors.length) return;

    let filtered = [...counsellors]; // Create a new array instead of reference

    // Filter by specialization
    if (specializationFilter !== 'all') {
      filtered = filtered.filter(counsellor => counsellor.specialization === specializationFilter);
    }

    // Filter by experience
    if (experienceFilter !== 'all') {
      const experienceNum = parseInt(experienceFilter);
      filtered = filtered.filter(counsellor => parseInt(counsellor.experience) >= experienceNum);
    }

    // Filter by location
    if (locationFilter !== 'all') {
      filtered = filtered.filter(counsellor => counsellor.city === locationFilter);
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

    // const available = await isDateAvailable(date);

    setSelectedDate(date);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setUserDetails(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleBookAppointment = async () => {
    if (!selectedCounsellor || !selectedDate) return;

    try {
      setLoading(true);

      // First check if the slot is available
      // const isAvailable = await counsellorBookingAPI.checkAvailability(
      //   selectedCounsellor._id,
      //   selectedDate
      // );

      // if (!isAvailable) {
      //   toast.error('This time slot is no longer available');
      //   setLoading(false);
      //   return;
      // }

      const bookingData: BookingCreateData = {
        counsellorId: selectedCounsellor._id,
        bookingDate: selectedDate,
        studentDetails: userDetails,
        studentId: localStorage.getItem('user_id'),
      };

      await counsellorBookingAPI.createBooking(bookingData);

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
          notes: '',
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

  const isDateAvailable = async (date: Date) => {
    if (!selectedCounsellor) return false;

    // First check if the date is in counsellor's available dates
    const isInAvailableDates = selectedCounsellor.availableDates.some(availableDate => {
      const available = new Date(availableDate);
      return (
        available.getDate() === date.getDate() &&
        available.getMonth() === date.getMonth() &&
        available.getFullYear() === date.getFullYear()
      );
    });

    if (!isInAvailableDates) return false;

    // Then check if the slot is not already booked
    try {
      return await counsellorBookingAPI.checkAvailability(selectedCounsellor._id, date);
    } catch (error) {
      console.error('Error checking date availability:', error);
      return false;
    }
  };

  // Get unique specializations, cities, and experiences for filters
  const specializations = [...new Set(counsellors.map(c => c.specialization))];
  const cities = [...new Set(counsellors.map(c => c.city))];
  const experiences = [...new Set(counsellors.map(c => c.experience))].sort(
    (a, b) => parseInt(a) - parseInt(b)
  );

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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="flex flex-col items-center space-y-6 sm:space-y-8">
          <div className="text-center space-y-3 sm:space-y-4">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
              Our Counsellors
            </h1>
            <p className="text-gray-600 text-sm sm:text-base max-w-2xl mx-auto px-4">
              Connect with experienced career counsellors who can guide you towards your dream
              career
            </p>
          </div>

          <Link
            to="/student/dashboard"
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors self-start"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            <span className="text-sm sm:text-base">Back to Dashboard</span>
          </Link>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8 mt-6">
          <div>
            <Label
              htmlFor="specialization-filter"
              className="text-sm font-medium text-gray-700 mb-2 block"
            >
              Specialization
            </Label>
            <Select value={specializationFilter} onValueChange={setSpecializationFilter}>
              <SelectTrigger id="specialization-filter" className="w-full h-10 sm:h-11">
                <SelectValue placeholder="Select specialization" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Specializations</SelectItem>
                {specializations.map(spec => (
                  <SelectItem key={spec} value={spec}>
                    {spec}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label
              htmlFor="experience-filter"
              className="text-sm font-medium text-gray-700 mb-2 block"
            >
              Minimum Experience
            </Label>
            <Select value={experienceFilter} onValueChange={setExperienceFilter}>
              <SelectTrigger id="experience-filter" className="w-full h-10 sm:h-11">
                <SelectValue placeholder="Select experience" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any Experience</SelectItem>
                {experiences.map(exp => (
                  <SelectItem key={exp} value={exp}>
                    {exp} years
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="sm:col-span-2 lg:col-span-1">
            <Label
              htmlFor="location-filter"
              className="text-sm font-medium text-gray-700 mb-2 block"
            >
              Location
            </Label>
            <Select value={locationFilter} onValueChange={setLocationFilter}>
              <SelectTrigger id="location-filter" className="w-full h-10 sm:h-11">
                <SelectValue placeholder="Select location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                {cities.map(city => (
                  <SelectItem key={city} value={city}>
                    {city}
                  </SelectItem>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
            {filteredCounsellors.map(counsellor => (
              <Card
                key={counsellor._id}
                className="cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1"
                onClick={() => handleCounsellorSelect(counsellor)}
              >
                <CardContent className="flex flex-col items-center p-4 sm:p-6 space-y-3 sm:space-y-4">
                  <Avatar className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24">
                    <AvatarImage
                      src={
                        counsellor.image ||
                        `https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80`
                      }
                      alt={counsellor.name}
                    />
                    <AvatarFallback className="text-sm sm:text-base lg:text-lg">
                      {counsellor.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>

                  <div className="text-center space-y-2 w-full">
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900 line-clamp-1">
                      {counsellor.name}
                    </h3>
                    <Badge variant="secondary" className="text-xs">
                      {counsellor.specialization}
                    </Badge>
                    <div className="space-y-1 text-xs sm:text-sm text-gray-600">
                      <p>{counsellor.experience} years experience</p>
                      <p className="line-clamp-1">
                        {counsellor.city}, {counsellor.state}
                      </p>
                    </div>
                  </div>

                  <div className="w-full space-y-2 text-xs text-gray-500">
                    <p className="truncate">{counsellor.phone}</p>
                    <p className="truncate">{counsellor.email}</p>
                  </div>
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
                  Your appointment with {selectedCounsellor?.name} on {selectedDate?.toDateString()}{' '}
                  has been confirmed.
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
                    disabled={date =>
                      date < new Date() ||
                      !selectedCounsellor?.availableDates.some(availableDate => {
                        const available = new Date(availableDate);
                        return (
                          available.getDate() === date.getDate() &&
                          available.getMonth() === date.getMonth() &&
                          available.getFullYear() === date.getFullYear()
                        );
                      })
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
                        disabled={
                          loading || !userDetails.name || !userDetails.email || !userDetails.phone
                        }
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
    </div>
  );
}

export default Counsellor;
