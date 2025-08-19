
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Star, MapPin, Clock, CheckCircle, MessageSquare, UserPlus, Calendar, Award, DollarSign } from "lucide-react";

interface FreelancerProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  freelancer: {
    id: number;
    name: string;
    avatar: string;
    title: string;
    rating: number;
    reviews: number;
    hourlyRate: number;
    skills: string[];
    bio: string;
    completedProjects: number;
    successRate: number;
    location: string;
  };
}

const FreelancerProfileModal = ({ isOpen, onClose, freelancer }: FreelancerProfileModalProps) => {
  const [activeTab, setActiveTab] = useState('overview');

  const portfolioItems = [
    {
      id: 1,
      title: "E-commerce Platform",
      description: "Built a complete e-commerce solution with React and Node.js",
      image: "/api/placeholder/300/200",
      technologies: ["React", "Node.js", "MongoDB"],
      client: "TechCorp Inc."
    },
    {
      id: 2,
      title: "Mobile Banking App",
      description: "Designed UI/UX for a secure mobile banking application",
      image: "/api/placeholder/300/200",
      technologies: ["React Native", "Figma", "TypeScript"],
      client: "FinanceHub"
    }
  ];

  const reviews = [
    {
      id: 1,
      client: "John Smith",
      rating: 5,
      comment: "Excellent work! Delivered on time and exceeded expectations.",
      project: "Website Development",
      date: "2 weeks ago"
    },
    {
      id: 2,
      client: "Sarah Johnson",
      rating: 4,
      comment: "Great communication and quality work. Highly recommended.",
      project: "Mobile App Design",
      date: "1 month ago"
    }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Freelancer Profile</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Profile Header */}
          <div className="flex items-start space-x-6">
            <Avatar className="h-24 w-24">
              <AvatarImage src={freelancer.avatar} />
              <AvatarFallback>{freelancer.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900">{freelancer.name}</h2>
              <p className="text-lg text-gray-600 mb-2">{freelancer.title}</p>
              
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center space-x-1">
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <span className="font-semibold">{freelancer.rating}</span>
                  <span className="text-gray-500">({freelancer.reviews} reviews)</span>
                </div>
                <div className="flex items-center space-x-1 text-gray-600">
                  <MapPin className="h-4 w-4" />
                  <span>{freelancer.location}</span>
                </div>
                <div className="flex items-center space-x-1 text-green-600 font-semibold">
                  <DollarSign className="h-4 w-4" />
                  <span>${freelancer.hourlyRate}/hr</span>
                </div>
              </div>

              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center space-x-1">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-gray-600">{freelancer.completedProjects} projects completed</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Award className="h-4 w-4 text-blue-500" />
                  <span className="text-sm text-gray-600">{freelancer.successRate}% success rate</span>
                </div>
              </div>

              <div className="flex space-x-3">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Send Message
                </Button>
                <Button variant="outline">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Invite to Project
                </Button>
                <Button variant="outline">
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule Interview
                </Button>
              </div>
            </div>
          </div>

          {/* Skills */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Skills</h3>
            <div className="flex flex-wrap gap-2">
              {freelancer.skills.map((skill, index) => (
                <Badge key={index} variant="secondary" className="bg-blue-100 text-blue-700">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>

          {/* Bio */}
          <div>
            <h3 className="text-lg font-semibold mb-3">About</h3>
            <p className="text-gray-700 leading-relaxed">{freelancer.bio}</p>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3 w-full">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Work Statistics</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Projects Completed:</span>
                      <span className="font-semibold">{freelancer.completedProjects}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Success Rate:</span>
                      <span className="font-semibold text-green-600">{freelancer.successRate}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Response Time:</span>
                      <span className="font-semibold">2 hours</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Availability</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <div className="h-3 w-3 bg-green-500 rounded-full"></div>
                      <span className="text-green-600 font-medium">Available Now</span>
                    </div>
                    <p className="text-gray-600 text-sm">Full-time (40+ hrs/week)</p>
                    <p className="text-gray-600 text-sm">EST timezone</p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="portfolio" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {portfolioItems.map((item) => (
                  <Card key={item.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-3">
                      <img src={item.image} alt={item.title} className="w-full h-40 object-cover rounded-lg mb-3" />
                      <CardTitle className="text-lg">{item.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 mb-3">{item.description}</p>
                      <div className="flex flex-wrap gap-1 mb-2">
                        {item.technologies.map((tech, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                      <p className="text-sm text-gray-500">Client: {item.client}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="reviews" className="space-y-4">
              {reviews.map((review) => (
                <Card key={review.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">{review.client}</CardTitle>
                        <p className="text-gray-600">{review.project}</p>
                      </div>
                      <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`h-4 w-4 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                          />
                        ))}
                        <span className="ml-2 text-sm text-gray-500">{review.date}</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700">{review.comment}</p>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FreelancerProfileModal;
