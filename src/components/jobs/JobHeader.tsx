
import { Bell, User, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useState } from 'react';

const JobHeader = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="h-16 md:h-20 bg-job-bg border-b border-border flex items-center justify-between px-4 md:px-6">
      {/* Left Side - Logo + Navigation */}
      <div className="flex items-center space-x-4 md:space-x-8">
        {/* Logo 
        <div className="text-xl md:text-2xl font-bold text-primary">Get Your Job</div>*/}
        
        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-4 xl:space-x-6">
          <a href="/jobs" className="text-sm font-medium text-job-text-primary border-b-2 border-primary pb-1">
            Find Jobs
          </a>
{/*           <a href="/employers" className="text-sm font-medium text-job-text-secondary hover:text-job-text-primary">
            Employers
          </a>
          <a href="/post-job" className="text-sm font-medium text-job-text-secondary hover:text-job-text-primary">
            Upload Job
          </a>
          <a href="/about" className="text-sm font-medium text-job-text-secondary hover:text-job-text-primary">
            About Us
          </a> */}
        </nav>

        {/* Mobile Menu Button */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="lg:hidden h-8 w-8"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <Menu className="h-5 w-5 text-job-text-secondary" />
        </Button>
      </div>

      {/* Right Side - User Info */}
      <div className="flex items-center space-x-2 md:space-x-4">
        {/* Notification Bell */}
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Bell className="h-4 w-4 md:h-5 md:w-5 text-job-text-secondary" />
        </Button>
        
        {/* User Info */}
        <div className="flex items-center space-x-2 md:space-x-3">
          <div className="text-right hidden sm:block">
            <p className="text-xs md:text-sm font-medium text-job-text-primary">Premium User</p>
            <p className="text-xs text-job-text-secondary">Job Search</p>
          </div>
          <Avatar className="h-7 w-7 md:h-8 md:w-8">
            <AvatarImage src="/placeholder-avatar.jpg" alt="Premium User" />
            <AvatarFallback className="bg-primary text-primary-foreground text-xs">MH</AvatarFallback>
          </Avatar>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div className="absolute top-16 left-0 right-0 bg-job-bg border-b border-border lg:hidden z-50">
          <nav className="flex flex-col space-y-2 p-4">
            <a href="/jobs" className="text-sm font-medium text-job-text-primary py-2">
              Find Jobs
            </a>
            <a href="/employers" className="text-sm font-medium text-job-text-secondary hover:text-job-text-primary py-2">
              Employers
            </a>
            <a href="/post-job" className="text-sm font-medium text-job-text-secondary hover:text-job-text-primary py-2">
              Upload Job
            </a>
            <a href="/about" className="text-sm font-medium text-job-text-secondary hover:text-job-text-primary py-2">
              About Us
            </a>
          </nav>
        </div>
      )}
    </header>
  );
};

export default JobHeader;
