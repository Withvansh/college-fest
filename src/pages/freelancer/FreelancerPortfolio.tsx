import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/hooks/useAuth';
import { Plus, ExternalLink, Edit, Trash2, Github, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

const FreelancerPortfolio = () => {
  const { user, logout } = useAuth();
  const [portfolioItems, setPortfolioItems] = useState([
    {
      id: 1,
      title: 'E-commerce Platform',
      description:
        'A full-stack e-commerce solution built with React, Node.js, and MongoDB. Features include user authentication, payment processing, inventory management, and admin dashboard.',
      tags: ['React', 'Node.js', 'MongoDB', 'Stripe'],
      link: 'https://github.com/example/ecommerce',
      type: 'github',
      image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=200&fit=crop',
    },
    {
      id: 2,
      title: 'Task Management App',
      description:
        'A collaborative task management tool with real-time updates, team collaboration features, and project tracking capabilities.',
      tags: ['TypeScript', 'Express', 'PostgreSQL', 'Socket.io'],
      link: 'https://taskmanager-demo.com',
      type: 'website',
      image: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=200&fit=crop',
    },
    {
      id: 3,
      title: 'Mobile Banking App UI',
      description:
        'Modern mobile banking application UI design with intuitive user experience and secure transaction flows.',
      tags: ['Figma', 'UI/UX', 'Mobile Design'],
      link: 'https://figma.com/example-banking-app',
      type: 'design',
      image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=200&fit=crop',
    },
  ]);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newItem, setNewItem] = useState({
    title: '',
    description: '',
    tags: '',
    link: '',
    type: 'website',
  });

  const handleAddItem = () => {
    if (!newItem.title || !newItem.description) {
      toast.error('Please fill in all required fields');
      return;
    }

    const item = {
      id: Date.now(),
      title: newItem.title,
      description: newItem.description,
      tags: newItem.tags.split(',').map(tag => tag.trim()),
      link: newItem.link,
      type: newItem.type,
      image: 'https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?w=400&h=200&fit=crop',
    };

    setPortfolioItems([...portfolioItems, item]);
    setNewItem({ title: '', description: '', tags: '', link: '', type: 'website' });
    setIsAddModalOpen(false);
    toast.success('Portfolio item added successfully!');
  };

  const handleDeleteItem = (id: number) => {
    setPortfolioItems(portfolioItems.filter(item => item.id !== id));
    toast.success('Portfolio item deleted successfully!');
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'github':
        return <Github className="h-4 w-4" />;
      case 'website':
        return <Globe className="h-4 w-4" />;
      default:
        return <ExternalLink className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">My Portfolio</h1>
              <p className="text-gray-600">Showcase your best work</p>
            </div>
            <div className="flex items-center space-x-4">
              <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Portfolio Item
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Add New Portfolio Item</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Title *</label>
                      <Input
                        value={newItem.title}
                        onChange={e => setNewItem({ ...newItem, title: e.target.value })}
                        placeholder="Project title"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Description *</label>
                      <Textarea
                        value={newItem.description}
                        onChange={e => setNewItem({ ...newItem, description: e.target.value })}
                        placeholder="Describe your project..."
                        rows={4}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Technologies/Skills</label>
                      <Input
                        value={newItem.tags}
                        onChange={e => setNewItem({ ...newItem, tags: e.target.value })}
                        placeholder="React, Node.js, MongoDB (comma separated)"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Project Link</label>
                      <Input
                        value={newItem.link}
                        onChange={e => setNewItem({ ...newItem, link: e.target.value })}
                        placeholder="https://..."
                      />
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleAddItem}>Add Item</Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
              <Button variant="outline" asChild>
                <Link to="/freelancer/dashboard">Back to Dashboard</Link>
              </Button>
              <Button variant="outline" onClick={logout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {portfolioItems.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Plus className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No portfolio items yet</h3>
              <p className="text-gray-600 mb-4">
                Start building your portfolio by adding your best work
              </p>
              <Button onClick={() => setIsAddModalOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Item
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {portfolioItems.map(item => (
              <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div
                  className="h-48 bg-cover bg-center"
                  style={{ backgroundImage: `url(${item.image})` }}
                />
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-semibold">{item.title}</h3>
                    <div className="flex space-x-1">
                      <Button size="sm" variant="ghost">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteItem(item.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">{item.description}</p>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {item.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  {item.link && (
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-purple-600 hover:text-purple-700 text-sm font-medium"
                    >
                      {getIcon(item.type)}
                      <span className="ml-2">View Project</span>
                    </a>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FreelancerPortfolio;
