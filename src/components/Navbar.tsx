import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Menu, X, User, LogOut, Settings, ShoppingBag } from 'lucide-react';
import { Button } from './ui/button';
import { useAuth } from '@/contexts/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'Jobs', href: '/jobs' },
  { name: 'Hire', href: '/hire' },
  { name: 'Products', href: '/products' },
  { name: 'Services', href: '/services' },
  { name: 'About', href: '/about' },
  { name: 'Plans', href: '/pricing' },
];

const GuestButtons = () => (
  <div className="flex items-center space-x-4">
    <NavLink to="/auth/jobseeker">
      <Button variant="outline" size="sm">
        Login
      </Button>
    </NavLink>
    <NavLink to="/auth/jobseeker">
      <Button size="sm">Sign Up</Button>
    </NavLink>
  </div>
);

const NavbarLinks = ({ onClick }: { onClick?: () => void }) => (
  <>
    {navLinks.map((link) => (
      <NavLink
        key={link.name}
        to={link.href}
        onClick={onClick}
        className={({ isActive }) =>
          `text-sm font-medium transition-colors flex items-center px-3 py-2 ${
            isActive ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
          }`
        }
      >
        {link.name === 'Templates Store' && <ShoppingBag className="h-4 w-4 mr-1" />}
        {link.name}
      </NavLink>
    ))}
  </>
);

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <NavLink to="/" className="flex items-center">
            <img src="/Logo.png" alt="MinuteHire" className="h-8 w-auto" />
            <span className="ml-2 text-xl font-bold text-gray-900">MinuteHire</span>
          </NavLink>

          {/* Desktop */}
          <div className="hidden md:flex items-center space-x-8">
            <NavbarLinks />
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 rounded-full relative">
                    <User className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <DropdownMenuItem onClick={() => navigate('/profile')}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/settings')}>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <GuestButtons />
            )}
          </div>

          {/* Mobile Hamburger */}
          <div className="md:hidden">
            <button
              aria-controls="mobile-menu"
              aria-expanded={isOpen}
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 bg-gray-50 space-y-1 sm:px-3">
            <NavbarLinks onClick={() => setIsOpen(false)} />
          </div>

          <div className="border-t border-gray-200 pt-4 pb-3">
            {user ? (
              <>
                <div className="flex items-center px-3">
                  <User className="h-8 w-8 rounded-full bg-gray-300 p-1" />
                  <div className="ml-3 text-base font-medium text-gray-800">{user.email}</div>
                </div>
                <div className="mt-3 space-y-1">
                  <NavLink
                    to="/profile"
                    className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600"
                    onClick={() => setIsOpen(false)}
                  >
                    Profile
                  </NavLink>
                  <button
                    onClick={async () => {
                      await handleLogout();
                      setIsOpen(false);
                    }}
                    className="w-full text-left block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600"
                  >
                    Sign out
                  </button>
                </div>
              </>
            ) : (
              <div className="pt-4 pb-3 px-3 space-y-2">
                <GuestButtons />
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
