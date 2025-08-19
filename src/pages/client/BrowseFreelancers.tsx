
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "react-router-dom";
import { ArrowLeft, Search, Filter, Star, MessageSquare, User, DollarSign } from "lucide-react";

const BrowseFreelancers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSkill, setSelectedSkill] = useState('');

  const freelancers = [
    {
      id: 1,
      name: "Alex Johnson",
      avatar: "/api/placeholder/80/80",
      title: "Full-Stack Developer",
      rating: 4.9,
      reviews: 47,
      hourlyRate: 45,
      skills: ["React.js", "Node.js", "MongoDB", "TypeScript"],
      bio: "Experienced full-stack developer with 5+ years building scalable web applications.",
      completedProjects: 52,
      successRate: 98,
      location: "San Francisco, CA"
    },
    {
      id: 2,
      name: "Sarah Wilson",
      avatar: "/api/placeholder/80/80",
      title: "UI/UX Designer",
      rating: 4.8,
      reviews: 31,
      hourlyRate: 40,
      skills: ["Figma", "Adobe XD", "Sketch", "Prototyping"],
      bio: "Creative designer focused on user-centered design and modern interfaces.",
      completedProjects: 38,
      successRate: 96,
      location: "New York, NY"
    },
    {
      id: 3,
      name: "Mike Chen",
      avatar: "/api/placeholder/80/80",
      title: "React Developer",
      rating: 4.9,
      reviews: 25,
      hourlyRate: 50,
      skills: ["React.js", "Next.js", "JavaScript", "CSS"],
      bio: "Frontend specialist with expertise in React ecosystem and modern web technologies.",
      completedProjects: 29,
      successRate: 100,
      location: "Los Angeles, CA"
    },
    {
      id: 4,
      name: "Emma Davis",
      avatar: "/api/placeholder/80/80",
      title: "Backend Developer",
      rating: 4.7,
      reviews: 42,
      hourlyRate: 48,
      skills: ["Python", "Django", "PostgreSQL", "AWS"],
      bio: "Backend engineer with strong experience in scalable architecture and APIs.",
      completedProjects: 45,
      successRate: 94,
      location: "Austin, TX"
    }
  ];

  const skills = ["React.js", "Node.js", "Python", "UI/UX", "Mobile", "WordPress"];

  const filteredFreelancers = freelancers.filter(freelancer => {
    const matchesSearch = freelancer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         freelancer.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         freelancer.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesSkill = !selectedSkill || freelancer.skills.some(skill => 
      skill.toLowerCase().includes(selectedSkill.toLowerCase())
    );
    
    return matchesSearch && matchesSkill;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/client/dashboard" className="flex items-center space-x-2 text-gray-600 hover:text-blue-600">
                <ArrowLeft className="h-5 w-5" />
                <span>Back to Dashboard</span>
              </Link>
            </div>
            <h1 className="text-xl font-bold text-gray-800">Browse Freelancers</h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search freelancers by name, skills, or expertise..."
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              More Filters
            </Button>
          </div>

          {/* Skill Tags */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedSkill === '' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedSkill('')}
            >
              All Skills
            </Button>
            {skills.map((skill) => (
              <Button
                key={skill}
                variant={selectedSkill === skill ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedSkill(skill)}
              >
                {skill}
              </Button>
            ))}
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            {filteredFreelancers.length} freelancer{filteredFreelancers.length !== 1 ? 's' : ''} found
          </p>
        </div>

        {/* Freelancer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFreelancers.map((freelancer) => (
            <Card key={freelancer.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <Avatar className="h-20 w-20 mx-auto mb-4">
                  <AvatarImage src={freelancer.avatar} />
                  <AvatarFallback>{freelancer.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <CardTitle className="text-lg">{freelancer.name}</CardTitle>
                <p className="text-gray-600">{freelancer.title}</p>
                <p className="text-sm text-gray-500">{freelancer.location}</p>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Rating and Rate */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="font-semibold">{freelancer.rating}</span>
                    <span className="text-sm text-gray-500">({freelancer.reviews})</span>
                  </div>
                  <div className="flex items-center text-green-600 font-semibold">
                    <DollarSign className="h-4 w-4" />
                    <span>{freelancer.hourlyRate}/hr</span>
                  </div>
                </div>

                {/* Bio */}
                <p className="text-sm text-gray-700 line-clamp-2">{freelancer.bio}</p>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Projects:</span>
                    <span className="font-semibold ml-1">{freelancer.completedProjects}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Success:</span>
                    <span className="font-semibold ml-1">{freelancer.successRate}%</span>
                  </div>
                </div>

                {/* Skills */}
                <div className="flex flex-wrap gap-1">
                  {freelancer.skills.slice(0, 3).map((skill, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                  {freelancer.skills.length > 3 && (
                    <Badge variant="secondary" className="text-xs">
                      +{freelancer.skills.length - 3}
                    </Badge>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2">
                  <Button size="sm" className="flex-1 bg-blue-600 hover:bg-blue-700">
                    <User className="h-4 w-4 mr-1" />
                    View Profile
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1">
                    <MessageSquare className="h-4 w-4 mr-1" />
                    Message
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Load More Button */}
        {filteredFreelancers.length > 0 && (
          <div className="text-center mt-8">
            <Button variant="outline" size="lg">
              Load More Freelancers
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BrowseFreelancers;
