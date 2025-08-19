
import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useSuperAdminAuth } from '@/contexts/SuperAdminAuthContext';
import { 
  LayoutDashboard, 
  Users, 
  School,
  FileText, 
  Bell,
  UserPlus,
  BarChart3,
  Activity,
  LogOut,
  Menu,
  X,
  Settings
} from 'lucide-react';

const SuperAdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { admin, logout } = useSuperAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/super-admin-login');
  };

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/super-admin/dashboard' },
    { icon: Users, label: 'User Management', path: '/super-admin/users' },
    { icon: School, label: 'College Management', path: '/super-admin/colleges' },
    { icon: FileText, label: 'Blog Management', path: '/super-admin/blogs' },
    { icon: Bell, label: 'Notifications', path: '/super-admin/notifications' },
    { icon: UserPlus, label: 'Onboarding Tracking', path: '/super-admin/onboarding' },
    { icon: BarChart3, label: 'Analytics', path: '/super-admin/analytics' },
    { icon: Activity, label: 'Activity Logs', path: '/super-admin/activity' },
    { icon: Settings, label: 'Settings', path: '/super-admin/settings' },
  ];

  const MenuItem = ({ item }: { item: typeof menuItems[0] }) => {
    const isActive = location.pathname === item.path;
    
    return (
      <button
        onClick={() => {
          navigate(item.path);
          setSidebarOpen(false);
        }}
        className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-red-50 transition-colors ${
          isActive ? 'bg-red-100 border-r-2 border-red-600 text-red-600' : 'text-gray-700'
        }`}
      >
        <item.icon className="h-5 w-5" />
        {item.label}
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:inset-0`}>
        
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <img 
              src="/lovable-uploads/0f6e5659-1efd-46cc-a890-d5abc0f69f2b.png" 
              alt="MinuteHire" 
              className="h-8 w-auto"
            />
            <span className="font-bold text-lg text-red-600">Super Admin</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="p-4 border-b bg-red-50">
          <p className="font-medium text-gray-900">{admin?.full_name || admin?.username}</p>
          <p className="text-sm text-red-600 capitalize">{admin?.role?.replace('_', ' ')}</p>
        </div>

        <nav className="flex-1 py-4">
          {menuItems.map((item, index) => (
            <MenuItem key={index} item={item} />
          ))}
        </nav>

        <div className="p-4 border-t">
          <Button
            variant="outline"
            className="w-full justify-start border-red-200 text-red-600 hover:bg-red-50"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 md:ml-0">
        <header className="bg-white shadow-sm border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            
            <h1 className="text-xl font-semibold text-gray-900">
              MinuteHire Super Admin Panel
            </h1>
            
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Welcome, {admin?.full_name || admin?.username}</span>
            </div>
          </div>
        </header>

        <main className="p-6">
          <Outlet />
        </main>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default SuperAdminLayout;
