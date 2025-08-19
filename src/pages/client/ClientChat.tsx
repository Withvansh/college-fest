
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { ArrowLeft, Send, Paperclip, Search, MoreVertical } from "lucide-react";

const ClientChat = () => {
  const [selectedChat, setSelectedChat] = useState(0);
  const [newMessage, setNewMessage] = useState('');

  const conversations = [
    {
      id: 1,
      freelancer: "Alex Johnson",
      avatar: "/api/placeholder/40/40",
      project: "E-commerce Website",
      lastMessage: "I've completed the UI design phase",
      timestamp: "2 min ago",
      unread: 2,
      online: true
    },
    {
      id: 2,
      freelancer: "Sarah Wilson",
      avatar: "/api/placeholder/40/40",
      project: "Mobile App Design",
      lastMessage: "When can we schedule the review call?",
      timestamp: "1 hour ago",
      unread: 0,
      online: false
    },
    {
      id: 3,
      freelancer: "Mike Chen",
      avatar: "/api/placeholder/40/40",
      project: "Dashboard Development",
      lastMessage: "Thanks for the feedback!",
      timestamp: "3 hours ago",
      unread: 1,
      online: true
    }
  ];

  const messages = [
    {
      id: 1,
      sender: "freelancer",
      message: "Hi! I've started working on your e-commerce website project.",
      timestamp: "10:30 AM",
      avatar: "/api/placeholder/32/32"
    },
    {
      id: 2,
      sender: "client",
      message: "Great! Can you share the initial wireframes?",
      timestamp: "10:35 AM"
    },
    {
      id: 3,
      sender: "freelancer",
      message: "Absolutely! Here are the wireframes for the homepage and product pages.",
      timestamp: "11:20 AM",
      avatar: "/api/placeholder/32/32"
    },
    {
      id: 4,
      sender: "freelancer",
      message: "I've completed the UI design phase and uploaded the files to the project milestone.",
      timestamp: "2:45 PM",
      avatar: "/api/placeholder/32/32"
    }
  ];

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // Add message logic here
      setNewMessage('');
    }
  };

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
            <h1 className="text-xl font-bold text-gray-800">Messages</h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
          {/* Conversations List */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Conversations</CardTitle>
                <Button variant="ghost" size="icon">
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-2">
                {conversations.map((conv, index) => (
                  <div
                    key={conv.id}
                    className={`p-4 cursor-pointer border-b hover:bg-gray-50 transition-colors ${
                      selectedChat === index ? 'bg-blue-50 border-blue-200' : ''
                    }`}
                    onClick={() => setSelectedChat(index)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={conv.avatar} />
                          <AvatarFallback>{conv.freelancer.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        {conv.online && (
                          <div className="absolute -bottom-1 -right-1 h-3 w-3 bg-green-500 rounded-full border-2 border-white"></div>
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="font-medium text-gray-900 truncate">{conv.freelancer}</p>
                          <span className="text-xs text-gray-500">{conv.timestamp}</span>
                        </div>
                        <p className="text-sm text-gray-600 truncate">{conv.project}</p>
                        <p className="text-sm text-gray-500 truncate">{conv.lastMessage}</p>
                      </div>
                      
                      {conv.unread > 0 && (
                        <Badge className="bg-blue-600 text-white text-xs">
                          {conv.unread}
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Chat Window */}
          <Card className="lg:col-span-2 flex flex-col">
            {/* Chat Header */}
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={conversations[selectedChat]?.avatar} />
                      <AvatarFallback>
                        {conversations[selectedChat]?.freelancer.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    {conversations[selectedChat]?.online && (
                      <div className="absolute -bottom-1 -right-1 h-3 w-3 bg-green-500 rounded-full border-2 border-white"></div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold">{conversations[selectedChat]?.freelancer}</h3>
                    <p className="text-sm text-gray-600">{conversations[selectedChat]?.project}</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>

            {/* Messages */}
            <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === 'client' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex items-end space-x-2 max-w-xs lg:max-w-md ${
                    msg.sender === 'client' ? 'flex-row-reverse space-x-reverse' : ''
                  }`}>
                    {msg.sender === 'freelancer' && (
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={msg.avatar} />
                        <AvatarFallback>A</AvatarFallback>
                      </Avatar>
                    )}
                    <div className={`rounded-lg px-3 py-2 ${
                      msg.sender === 'client' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-100 text-gray-900'
                    }`}>
                      <p className="text-sm">{msg.message}</p>
                      <p className={`text-xs mt-1 ${
                        msg.sender === 'client' ? 'text-blue-100' : 'text-gray-500'
                      }`}>
                        {msg.timestamp}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>

            {/* Message Input */}
            <div className="p-4 border-t bg-gray-50">
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="icon">
                  <Paperclip className="h-4 w-4" />
                </Button>
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1"
                />
                <Button onClick={handleSendMessage} className="bg-blue-600 hover:bg-blue-700">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ClientChat;
