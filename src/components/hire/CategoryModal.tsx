import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Star, MapPin, Clock, User } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { BookingModal } from './BookingModal';

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: { id: string; name: string; icon: any; color: string } | null;
}

interface HireProfile {
  id: string;
  name: string;
  age: number;
  gender: string;
  location: string;
  job_category: string;
  experience_years: number;
  rating: number;
  bio: string;
  photo_url?: string;
}

export const CategoryModal: React.FC<CategoryModalProps> = ({ isOpen, onClose, category }) => {
  const [profiles, setProfiles] = useState<HireProfile[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<HireProfile | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);

  const [locationFilter, setLocationFilter] = useState('');
  const [genderFilter, setGenderFilter] = useState('');
  const [experienceFilter, setExperienceFilter] = useState('all');
  const [ratingFilter, setRatingFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    if (isOpen && category) fetchProfiles();
  }, [isOpen, category]);

  useEffect(() => {
    if (isOpen) fetchProfiles();
  }, [locationFilter, genderFilter, experienceFilter, ratingFilter, sortBy]);

  const fetchProfiles = async () => {
    if (!category) return;
    setLoading(true);
    console.log('🔍 Fetching profiles for category:', category.id);

    try {
      let query = supabase
        .from('hire_profiles')
        .select('*')
        .eq('is_active', true)
        .ilike('job_category', category.name);

      console.log('📍 Location Filter:', locationFilter);
      console.log('🧑 Gender Filter:', genderFilter);
      console.log('📊 Experience Filter:', experienceFilter);
      console.log('⭐ Rating Filter:', ratingFilter);
      console.log('↕️ Sort By:', sortBy);

      if (locationFilter) query = query.ilike('location', `%${locationFilter}%`);
      if (genderFilter && genderFilter !== 'all') query = query.eq('gender', genderFilter);
      if (experienceFilter !== 'all') {
        const [min, max] = experienceFilter.split('-').map(Number);
        if (max) query = query.gte('experience_years', min).lte('experience_years', max);
        else query = query.gte('experience_years', min);
      }
      if (ratingFilter !== 'all') query = query.gte('rating', parseFloat(ratingFilter));

      switch (sortBy) {
        case 'newest':
          query = query.order('created_at', { ascending: false });
          break;
        case 'experienced':
          query = query.order('experience_years', { ascending: false });
          break;
        case 'rated':
          query = query.order('rating', { ascending: false });
          break;
      }

      const { data, error } = await query;
      console.log('✅ Supabase Response:', data);
      if (error) console.error('❌ Supabase Error:', error);
      if (error) throw error;
      setProfiles(data || []);
    } catch (error) {
      console.error('❗ Error fetching profiles:', error);
      toast.error('Failed to load profiles');
    } finally {
      setLoading(false);
    }
  };

  const handleBookNow = (profile: HireProfile) => {
    console.log('📥 Selected profile to book:', profile);
    setSelectedProfile(profile);
    setShowBookingModal(true);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
    ));
  };

  if (!category) return null;
  const Icon = category.icon;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto" aria-describedby="dialog-description">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-2xl">
              <p id="dialog-description" className="sr-only">
                Browse and book people in this job category using filters like location, gender, and rating.
              </p>
              <div className={`${category.color} w-10 h-10 rounded-full flex items-center justify-center`}>
                <Icon className="h-6 w-6 text-white" />
              </div>
              Available {category.name}s
            </DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            <Input placeholder="Location" value={locationFilter} onChange={(e) => setLocationFilter(e.target.value)} />
            <Select value={genderFilter} onValueChange={setGenderFilter}>
              <SelectTrigger><SelectValue placeholder="Gender" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Genders</SelectItem>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            <Select value={experienceFilter} onValueChange={setExperienceFilter}>
              <SelectTrigger><SelectValue placeholder="Experience" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any Experience</SelectItem>
                <SelectItem value="0-1">0-1 Years</SelectItem>
                <SelectItem value="1-3">1-3 Years</SelectItem>
                <SelectItem value="3-5">3-5 Years</SelectItem>
                <SelectItem value="5">5+ Years</SelectItem>
              </SelectContent>
            </Select>
            <Select value={ratingFilter} onValueChange={setRatingFilter}>
              <SelectTrigger><SelectValue placeholder="Rating" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any Rating</SelectItem>
                <SelectItem value="4">4+ Stars</SelectItem>
                <SelectItem value="3">3+ Stars</SelectItem>
                <SelectItem value="2">2+ Stars</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger><SelectValue placeholder="Sort by" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="experienced">Most Experienced</SelectItem>
                <SelectItem value="rated">Top Rated</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator />

          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading profiles...</p>
            </div>
          ) : profiles.length === 0 ? (
            <div className="text-center py-8">
              <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No profiles found for this category.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
              {profiles.map((profile) => (
                <Card key={profile.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden">
                        {profile.photo_url ? (
                          <img src={profile.photo_url} alt={profile.name} className="w-full h-full object-cover" />
                        ) : (
                          <User className="h-6 w-6 text-gray-600" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold">{profile.name}</h3>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span>{profile.age} years</span>
                          <Badge variant="outline" className="capitalize">{profile.gender}</Badge>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        <span>{profile.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <span>{profile.experience_years}+ Years Experience</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex">{renderStars(profile.rating)}</div>
                        <span className="text-sm text-gray-600">({profile.rating.toFixed(1)})</span>
                      </div>
                      {profile.bio && (
                        <p className="text-sm text-gray-600 line-clamp-2">{profile.bio}</p>
                      )}
                      <Button className="w-full" onClick={() => handleBookNow(profile)}>Book Now</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>

      <BookingModal
        isOpen={showBookingModal}
        onClose={() => setShowBookingModal(false)}
        profile={selectedProfile}
      />
    </>
  );
};

// import React, { useState, useEffect } from 'react';
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { Badge } from '@/components/ui/badge';
// import { Card, CardContent, CardHeader } from '@/components/ui/card';
// import { Separator } from '@/components/ui/separator';
// import { Star, MapPin, Clock, User } from 'lucide-react';
// import { supabase } from '@/integrations/supabase/client';
// import { toast } from 'sonner';
// import { BookingModal } from './BookingModal';

// interface CategoryModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   category: { id: string; name: string; icon: any; color: string } | null;
// }

// interface HireProfile {
//   id: string;
//   name: string;
//   age: number;
//   gender: string;
//   location: string;
//   job_category: string;
//   experience_years: number;
//   rating: number;
//   bio: string;
//   photo_url?: string;
// }

// export const CategoryModal: React.FC<CategoryModalProps> = ({ isOpen, onClose, category }) => {
//   const [profiles, setProfiles] = useState<HireProfile[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [selectedProfile, setSelectedProfile] = useState<HireProfile | null>(null);
//   const [showBookingModal, setShowBookingModal] = useState(false);
  
//   // Filter states
//   const [locationFilter, setLocationFilter] = useState('');
//   const [genderFilter, setGenderFilter] = useState('');
//   const [experienceFilter, setExperienceFilter] = useState('all');
//   const [ratingFilter, setRatingFilter] = useState('all');
//   const [sortBy, setSortBy] = useState('newest');

//   useEffect(() => {
//     if (isOpen && category) {
//       fetchProfiles();
//     }
//   }, [isOpen, category]);

//  const fetchProfiles = async () => {
//   if (!category) return;

//   setLoading(true);
//   console.log('🔍 Fetching profiles for category:', category.id);

//   try {
//     let query = supabase
//       .from('hire_profiles')
//       .select('*')
//       .eq('is_active', true)
//      .ilike('job_category', category.name) // ✅ Use exact match

//     // Log filter states
//     console.log('📍 Location Filter:', locationFilter);
//     console.log('🧑 Gender Filter:', genderFilter);
//     console.log('📊 Experience Filter:', experienceFilter);
//     console.log('⭐ Rating Filter:', ratingFilter);
//     console.log('↕️ Sort By:', sortBy);

//     // Apply filters
//     if (locationFilter) {
//       query = query.ilike('location', `%${locationFilter}%`);
//     }

//     if (genderFilter && genderFilter !== 'all') {
//       query = query.eq('gender', genderFilter);
//     }

//     if (experienceFilter !== 'all') {
//       const [min, max] = experienceFilter.split('-').map(Number);
//       if (max) {
//         query = query.gte('experience_years', min).lte('experience_years', max);
//       } else {
//         query = query.gte('experience_years', min);
//       }
//     }

//     if (ratingFilter !== 'all') {
//       query = query.gte('rating', parseFloat(ratingFilter));
//     }

//     // Sorting
//     switch (sortBy) {
//       case 'newest':
//         query = query.order('created_at', { ascending: false });
//         break;
//       case 'experienced':
//         query = query.order('experience_years', { ascending: false });
//         break;
//       case 'rated':
//         query = query.order('rating', { ascending: false });
//         break;
//     }

//     const { data, error } = await query;

//     console.log('✅ Supabase Response:', data);
//     if (error) console.error('❌ Supabase Error:', error);

//     if (error) throw error;
//     setProfiles(data || []);
//   } catch (error) {
//     console.error('❗ Error fetching profiles:', error);
//     toast.error('Failed to load profiles');
//   } finally {
//     setLoading(false);
//   }
// };
//   const handleBookNow = (profile: HireProfile) => {
//     setSelectedProfile(profile);
//     setShowBookingModal(true);
//   };

//   const renderStars = (rating: number) => {
//     return Array.from({ length: 5 }, (_, i) => (
//       <Star
//         key={i}
//         className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
//       />
//     ));
//   };

//   useEffect(() => {
//     if (isOpen) {
//       fetchProfiles();
//     }
//   }, [locationFilter, genderFilter, experienceFilter, ratingFilter, sortBy]);

//   if (!category) return null;

//   const Icon = category.icon;

//   return (
//     <>
//       <Dialog open={isOpen} onOpenChange={onClose}>
//        <DialogContent
//   className="max-w-6xl max-h-[90vh] overflow-y-auto"
//   aria-describedby="dialog-description"
// >
//           <DialogHeader>
//             <DialogTitle className="flex items-center gap-3 text-2xl">
//               <p id="dialog-description" className="sr-only">
//   Browse and book people in this job category using filters like location, gender, and rating.
// </p>
//               <div className={`${category.color} w-10 h-10 rounded-full flex items-center justify-center`}>
//                 <Icon className="h-6 w-6 text-white" />
//               </div>
//               Available {category.name}s
//             </DialogTitle>
//           </DialogHeader>

//           {/* Filters */}
//           <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
//             <Input
//               placeholder="Location"
//               value={locationFilter}
//               onChange={(e) => setLocationFilter(e.target.value)}
//             />
//             <Select value={genderFilter} onValueChange={setGenderFilter}>
//               <SelectTrigger>
//                 <SelectValue placeholder="Gender" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="all">All Genders</SelectItem>
//                 <SelectItem value="male">Male</SelectItem>
//                 <SelectItem value="female">Female</SelectItem>
//                 <SelectItem value="other">Other</SelectItem>
//               </SelectContent>
//             </Select>
//             <Select value={experienceFilter} onValueChange={setExperienceFilter}>
//               <SelectTrigger>
//                 <SelectValue placeholder="Experience" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="all">Any Experience</SelectItem>
//                 <SelectItem value="0-1">0-1 Years</SelectItem>
//                 <SelectItem value="1-3">1-3 Years</SelectItem>
//                 <SelectItem value="3-5">3-5 Years</SelectItem>
//                 <SelectItem value="5">5+ Years</SelectItem>
//               </SelectContent>
//             </Select>
//             <Select value={ratingFilter} onValueChange={setRatingFilter}>
//               <SelectTrigger>
//                 <SelectValue placeholder="Rating" />
//               </SelectTrigger>
//               <SelectContent>
//                <SelectItem value="all">Any Rating</SelectItem>
//                 <SelectItem value="4">4+ Stars</SelectItem>
//                 <SelectItem value="3">3+ Stars</SelectItem>
//                 <SelectItem value="2">2+ Stars</SelectItem>
//               </SelectContent>
//             </Select>
//             <Select value={sortBy} onValueChange={setSortBy}>
//               <SelectTrigger>
//                 <SelectValue placeholder="Sort by" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="newest">Newest</SelectItem>
//                 <SelectItem value="experienced">Most Experienced</SelectItem>
//                 <SelectItem value="rated">Top Rated</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>

//           <Separator />

//           {/* Profiles Grid */}
//           {loading ? (
//             <div className="text-center py-8">
//               <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
//               <p className="mt-4 text-gray-600">Loading profiles...</p>
//             </div>
//           ) : profiles.length === 0 ? (
//             <div className="text-center py-8">
//               <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
//               <p className="text-gray-600">No profiles found for this category.</p>
//             </div>
//           ) : (
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
//               {profiles.map((profile) => (
//                 <Card key={profile.id} className="hover:shadow-lg transition-shadow">
//                   <CardHeader className="pb-3">
//                     <div className="flex items-center gap-3">
//                       <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden">
//                         {profile.photo_url ? (
//                           <img 
//                             src={profile.photo_url} 
//                             alt={profile.name}
//                             className="w-full h-full object-cover"
//                           />
//                         ) : (
//                           <User className="h-6 w-6 text-gray-600" />
//                         )}
//                       </div>
//                       <div>
//                         <h3 className="font-semibold">{profile.name}</h3>
//                         <div className="flex items-center gap-4 text-sm text-gray-600">
//                           <span>{profile.age} years</span>
//                           <Badge variant="outline" className="capitalize">
//                             {profile.gender}
//                           </Badge>
//                         </div>
//                       </div>
//                     </div>
//                   </CardHeader>
//                   <CardContent>
//                     <div className="space-y-3">
//                       <div className="flex items-center gap-2 text-sm">
//                         <MapPin className="h-4 w-4 text-gray-500" />
//                         <span>{profile.location}</span>
//                       </div>
//                       <div className="flex items-center gap-2 text-sm">
//                         <Clock className="h-4 w-4 text-gray-500" />
//                         <span>{profile.experience_years}+ Years Experience</span>
//                       </div>
//                       <div className="flex items-center gap-2">
//                         <div className="flex">{renderStars(profile.rating)}</div>
//                         <span className="text-sm text-gray-600">({profile.rating.toFixed(1)})</span>
//                       </div>
//                       {profile.bio && (
//                         <p className="text-sm text-gray-600 line-clamp-2">{profile.bio}</p>
//                       )}
//                       <Button 
//                         className="w-full"
//                         onClick={() => handleBookNow(profile)}
//                       >
//                         Book Now
//                       </Button>
//                     </div>
//                   </CardContent>
//                 </Card>
//               ))}
//             </div>
//           )}
//         </DialogContent>
//       </Dialog>

//       {/* Booking Modal */}
//       <BookingModal
//         isOpen={showBookingModal}
//         onClose={() => setShowBookingModal(false)}
//         profile={selectedProfile}
//       />
//     </>
//   );
// };
