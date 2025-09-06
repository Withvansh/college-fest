import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Menu, X, User, LogOut, Settings, ShoppingBag, Bell, Search } from 'lucide-react';
import { Button } from './ui/button';
import { useAuth } from '@/hooks/useAuth';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'Jobs', href: '/jobs' },
  { name: 'Hire', href: '/hire' },
  { name: 'Products', href: '/products' },
  { name: 'StartUp', href: '/startup-job' },
  { name: 'Services', href: '/services' },
  { name: 'About', href: '/about' },
  { name: 'Plans', href: '/pricing' },
];

const GuestButtons = () => (
  <div className="flex items-center space-x-3">
    <NavLink to="/auth?tab=login">
      <Button
        variant="ghost"
        size="sm"
        className="text-gray-600 hover:text-gray-900 hover:bg-gray-100/80 font-medium transition-all duration-200"
      >
        Login
      </Button>
    </NavLink>
    <NavLink to="/auth?tab=signup">
      <Button
        size="sm"
        className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium px-6 py-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
      >
        Sign Up
      </Button>
    </NavLink>
  </div>
);

const NavbarLinks = ({ onClick }: { onClick?: () => void }) => (
  <>
    {navLinks.map(link => (
      <NavLink
        key={link.name}
        to={link.href}
        onClick={onClick}
        className={({ isActive }) =>
          `relative text-sm font-medium transition-all duration-300 flex items-center px-4 py-2 rounded-lg group ${
            isActive
              ? 'text-blue-600 bg-blue-50/80'
              : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50/80'
          }`
        }
      >
        {link.name === 'Templates Store' && <ShoppingBag className="h-4 w-4 mr-2" />}
        {link.name}
        {/* Active indicator */}
        <span
          className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 h-0.5 bg-blue-600 transition-all duration-300 ${({
            isActive,
          }) => (isActive ? 'w-full' : 'w-0 group-hover:w-full')}`}
        />
      </NavLink>
    ))}
  </>
);

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // fetching role from localStorage for conditional rendering
  const role = user?.role || localStorage.getItem('user_role');
  console.log('Current user role:', role);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-lg shadow-lg border-b border-gray-200/50'
          : 'bg-white/90 backdrop-blur-md shadow-md'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo Section */}
          <NavLink to="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <img
                src="/Logo.png"
                alt="MinuteHire"
                className="h-9 w-auto transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              MinuteHire
            </span>
          </NavLink>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-2">
            <NavbarLinks />
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {/* Search Icon for larger screens */}
            {/* <div className="hidden md:block">
              <Button
                variant="ghost"
                size="sm"
                className="h-9 w-9 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100/80"
              >
                <Search className="h-4 w-4" />
              </Button>
            </div> */}

            {user ? (
              <div className="flex items-center space-x-3">
                {/* Notifications */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-9 w-9 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100/80 relative"
                >
                  <Bell className="h-4 w-4" />
                  <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full text-xs flex items-center justify-center">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500"></span>
                  </span>
                </Button>

                {/* User Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                      <User className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className="w-56 bg-white/95 backdrop-blur-lg border border-gray-200/50 shadow-xl"
                    align="end"
                  >
                    <DropdownMenuItem
                      onClick={() => navigate(`${role}/profile`)}
                      className="cursor-pointer hover:bg-blue-50/80"
                    >
                      <User className="mr-2 h-4 w-4 text-blue-600" />
                      <span>Dashboard</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="cursor-pointer hover:bg-red-50/80 text-red-600"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <GuestButtons />
            )}

            {/* Mobile Hamburger */}
            <div className="lg:hidden">
              <button
                aria-controls="mobile-menu"
                aria-expanded={isOpen}
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-xl text-gray-500 hover:text-gray-700 hover:bg-gray-100/80 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 transition-all duration-200"
              >
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden animate-in slide-in-from-top duration-300" id="mobile-menu">
          <div className="px-4 pt-4 pb-6 bg-white/95 backdrop-blur-lg border-t border-gray-200/50 shadow-lg">
            {/* Mobile Navigation Links */}
            <div className="space-y-2 mb-6">
              <NavbarLinks onClick={() => setIsOpen(false)} />
            </div>

            {/* Mobile Search */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search jobs, companies..."
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Mobile User Section */}
            {user ? (
              <div className="border-t border-gray-200 pt-4">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                    <User className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">{user.email}</div>
                    <div className="text-xs text-gray-500 capitalize">{role}</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <NavLink
                    to={`/${role}/profile`}
                    className="flex items-center px-4 py-3 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    <User className="mr-3 h-4 w-4" />
                    Dashboard
                  </NavLink>
                  <button
                    onClick={async () => {
                      await handleLogout();
                      setIsOpen(false);
                    }}
                    className="w-full flex items-center px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <LogOut className="mr-3 h-4 w-4" />
                    Sign out
                  </button>
                </div>
              </div>
            ) : (
              <div className="border-t border-gray-200 pt-4">
                <div className="space-y-3">
                  <NavLink to="/auth?tab=login" onClick={() => setIsOpen(false)}>
                    <Button
                      variant="outline"
                      className="w-full justify-center py-3 text-sm font-medium border-gray-300 hover:bg-gray-50"
                    >
                      Login
                    </Button>
                  </NavLink>
                  <NavLink to="/auth?tab=signup" onClick={() => setIsOpen(false)}>
                    <Button className="w-full justify-center py-3 text-sm font-medium bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
                      Sign Up
                    </Button>
                  </NavLink>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
