import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import axios from '@/lib/utils/axios';
import {
  Building2,
  Plus,
  Edit,
  Trash2,
  Users,
  MapPin,
  Globe,
  TrendingUp,
  CheckCircle,
  X,
} from 'lucide-react';

interface Startup {
  _id: string;
  startup_name: string;
  founder_name?: string;
  industry?: string;
  website?: string;
  location?: string;
  phone?: string;
  description?: string;
  funding_stage?: string;
  employees_count?: number;
  logo_url?: string;
  created_at: string;
  is_active?: boolean;
}

interface ManageStartupsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartupSelect?: (startup: Startup) => void;
}

const ManageStartupsModal: React.FC<ManageStartupsModalProps> = ({
  isOpen,
  onClose,
  onStartupSelect,
}) => {
  const { user } = useAuth();
  const [startups, setStartups] = useState<Startup[]>([]);
  const [loading, setLoading] = useState(false);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingStartup, setEditingStartup] = useState<Startup | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    startup_name: '',
    founder_name: '',
    industry: '',
    website: '',
    location: '',
    phone: '',
    description: '',
    funding_stage: '',
    employees_count: '',
    logo_url: '',
  });

  const fundingStages = [
    'Pre-seed',
    'Seed',
    'Series A',
    'Series B',
    'Series C',
    'Series D+',
    'IPO',
    'Acquired',
    'Bootstrapped',
  ];

  const industries = [
    'Technology',
    'Healthcare',
    'Finance',
    'Education',
    'E-commerce',
    'Gaming',
    'Social Media',
    'Enterprise Software',
    'Consumer Apps',
    'Artificial Intelligence',
    'Blockchain',
    'Cybersecurity',
    'Digital Marketing',
    'Cloud Services',
    'Mobile Development',
    'Web Development',
    'Data Analytics',
    'IoT',
    'Renewable Energy',
    'Biotech',
    'Other',
  ];

  const loadStartups = useCallback(async () => {
    if (!user?._id) return;

    try {
      setLoading(true);
      const response = await axios.get(`/user/${user._id}/startups`);
      setStartups(response.data.startups || []);
    } catch (error) {
      console.error('Error loading startups:', error);
      toast.error('Failed to load startups');
    } finally {
      setLoading(false);
    }
  }, [user?._id]);

  useEffect(() => {
    if (isOpen && user?._id) {
      loadStartups();
    }
  }, [isOpen, user?._id, loadStartups]);

  const resetForm = () => {
    setFormData({
      startup_name: '',
      founder_name: '',
      industry: '',
      website: '',
      location: '',
      phone: '',
      description: '',
      funding_stage: '',
      employees_count: '',
      logo_url: '',
    });
    setEditingStartup(null);
    setIsAddingNew(false);
  };

  const handleAddNew = () => {
    resetForm();
    setIsAddingNew(true);
  };

  const handleEdit = (startup: Startup) => {
    setFormData({
      startup_name: startup.startup_name,
      founder_name: startup.founder_name || '',
      industry: startup.industry || '',
      website: startup.website || '',
      location: startup.location || '',
      phone: startup.phone || '',
      description: startup.description || '',
      funding_stage: startup.funding_stage || '',
      employees_count: startup.employees_count?.toString() || '',
      logo_url: startup.logo_url || '',
    });
    setEditingStartup(startup);
    setIsAddingNew(true);
  };

  const handleSave = async () => {
    if (!formData.startup_name.trim()) {
      toast.error('Startup name is required');
      return;
    }

    try {
      setLoading(true);
      const payload = {
        ...formData,
        employees_count: formData.employees_count ? parseInt(formData.employees_count) : undefined,
      };

      if (editingStartup) {
        // Update existing startup
        await axios.put(`/startup/${editingStartup._id}`, payload);
        toast.success('Startup updated successfully');
      } else {
        // Create new startup
        await axios.post('/startup', payload);
        toast.success('Startup added successfully');
      }

      await loadStartups();
      resetForm();
    } catch (error) {
      console.error('Error saving startup:', error);
      toast.error('Failed to save startup');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (startupId: string) => {
    if (!confirm('Are you sure you want to delete this startup?')) {
      return;
    }

    try {
      setLoading(true);
      await axios.delete(`/startup/${startupId}`);
      toast.success('Startup deleted successfully');
      await loadStartups();
    } catch (error) {
      console.error('Error deleting startup:', error);
      toast.error('Failed to delete startup');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectStartup = (startup: Startup) => {
    if (onStartupSelect) {
      onStartupSelect(startup);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Building2 className="h-5 w-5 mr-2" />
            Manage Startups
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header Actions */}
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold">Your Startups</h3>
              <p className="text-sm text-gray-600">
                Manage and switch between your different startup ventures
              </p>
            </div>
            <Button onClick={handleAddNew} disabled={isAddingNew}>
              <Plus className="h-4 w-4 mr-2" />
              Add New Startup
            </Button>
          </div>

          {/* Add/Edit Form */}
          {isAddingNew && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  {editingStartup ? 'Edit Startup' : 'Add New Startup'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startup_name">Startup Name *</Label>
                    <Input
                      id="startup_name"
                      value={formData.startup_name}
                      onChange={e =>
                        setFormData(prev => ({ ...prev, startup_name: e.target.value }))
                      }
                      placeholder="Enter startup name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="founder_name">Founder Name</Label>
                    <Input
                      id="founder_name"
                      value={formData.founder_name}
                      onChange={e =>
                        setFormData(prev => ({ ...prev, founder_name: e.target.value }))
                      }
                      placeholder="Enter founder name"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="industry">Industry</Label>
                    <Select
                      value={formData.industry}
                      onValueChange={value => setFormData(prev => ({ ...prev, industry: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select industry" />
                      </SelectTrigger>
                      <SelectContent>
                        {industries.map(industry => (
                          <SelectItem key={industry} value={industry}>
                            {industry}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="funding_stage">Funding Stage</Label>
                    <Select
                      value={formData.funding_stage}
                      onValueChange={value =>
                        setFormData(prev => ({ ...prev, funding_stage: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select funding stage" />
                      </SelectTrigger>
                      <SelectContent>
                        {fundingStages.map(stage => (
                          <SelectItem key={stage} value={stage}>
                            {stage}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      type="url"
                      value={formData.website}
                      onChange={e => setFormData(prev => ({ ...prev, website: e.target.value }))}
                      placeholder="https://example.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={e => setFormData(prev => ({ ...prev, location: e.target.value }))}
                      placeholder="City, Country"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={e => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="employees_count">Number of Employees</Label>
                    <Input
                      id="employees_count"
                      type="number"
                      min="0"
                      value={formData.employees_count}
                      onChange={e =>
                        setFormData(prev => ({ ...prev, employees_count: e.target.value }))
                      }
                      placeholder="0"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Tell us about your startup..."
                    rows={3}
                  />
                </div>

                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={resetForm}>
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                  <Button onClick={handleSave} disabled={loading}>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    {loading ? 'Saving...' : editingStartup ? 'Update' : 'Add Startup'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Startups List */}
          <div className="space-y-4">
            {loading && startups.length === 0 ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading startups...</p>
              </div>
            ) : startups.length === 0 ? (
              <Card>
                <CardContent className="text-center py-8">
                  <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No startups yet</h3>
                  <p className="text-gray-600 mb-4">
                    Get started by adding your first startup venture.
                  </p>
                  <Button onClick={handleAddNew}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your First Startup
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {startups.map(startup => (
                  <Card key={startup._id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          {startup.logo_url ? (
                            <img
                              src={startup.logo_url}
                              alt={startup.startup_name}
                              className="h-10 w-10 rounded-full object-cover"
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                              <Building2 className="h-5 w-5 text-white" />
                            </div>
                          )}
                          <div>
                            <CardTitle className="text-base">{startup.startup_name}</CardTitle>
                            {startup.founder_name && (
                              <p className="text-sm text-gray-600">by {startup.founder_name}</p>
                            )}
                          </div>
                        </div>
                        <div className="flex space-x-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(startup)}
                            disabled={isAddingNew}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(startup._id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex flex-wrap gap-2">
                        {startup.industry && (
                          <Badge variant="secondary" className="text-xs">
                            {startup.industry}
                          </Badge>
                        )}
                        {startup.funding_stage && (
                          <Badge variant="outline" className="text-xs">
                            {startup.funding_stage}
                          </Badge>
                        )}
                      </div>

                      <div className="space-y-2 text-sm text-gray-600">
                        {startup.location && (
                          <div className="flex items-center">
                            <MapPin className="h-3 w-3 mr-2" />
                            {startup.location}
                          </div>
                        )}
                        {startup.website && (
                          <div className="flex items-center">
                            <Globe className="h-3 w-3 mr-2" />
                            <a
                              href={startup.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline"
                            >
                              {startup.website}
                            </a>
                          </div>
                        )}
                        {startup.employees_count && (
                          <div className="flex items-center">
                            <Users className="h-3 w-3 mr-2" />
                            {startup.employees_count} employees
                          </div>
                        )}
                      </div>

                      {startup.description && (
                        <p className="text-sm text-gray-700 line-clamp-2">{startup.description}</p>
                      )}

                      <div className="flex justify-between items-center pt-2">
                        <span className="text-xs text-gray-500">
                          Added {new Date(startup.created_at).toLocaleDateString()}
                        </span>
                        {onStartupSelect && (
                          <Button
                            size="sm"
                            onClick={() => handleSelectStartup(startup)}
                            className="text-xs"
                          >
                            Select
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ManageStartupsModal;
