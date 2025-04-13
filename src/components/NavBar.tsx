
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import {
  Briefcase,
  Calendar,
  Home,
  Book,
  Users,
  Save,
  LogOut,
  LogIn,
  UserPlus,
  BrainCircuit,
} from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"

const NavBar: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  // Update 'Jobs' to 'Hiring'
  const navigationItems = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Internships', href: '/internships', icon: Briefcase },
    { name: 'Hiring', href: '/hiring', icon: Briefcase },
    { name: 'Calendar', href: '/calendar', icon: Calendar },
    { name: 'Resources', href: '/resources', icon: Book },
    { name: 'AI Quiz', href: '/ai-quiz', icon: BrainCircuit },
    { name: 'Community', href: '/community', icon: Users },
    { name: 'Saved', href: '/saved', icon: Save },
  ];

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-ipblue-600 font-bold text-xl">
              IP Drive
            </Link>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                {navigationItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`text-gray-600 hover:bg-gray-100 px-3 py-2 rounded-md text-sm font-medium ${location.pathname === item.href ? 'bg-gray-100' : ''
                      }`}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6">
              {user ? (
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600">
                    {user.username}
                  </span>
                  <button
                    onClick={() => logout()}
                    className="bg-ipblue-600 hover:bg-ipblue-700 text-white px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="flex space-x-4">
                  <Link
                    to="/login"
                    className="text-gray-600 hover:bg-gray-100 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="bg-ipblue-600 hover:bg-ipblue-700 text-white px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
          <div className="-mr-2 flex md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=open]:bg-accent data-[state=open]:text-accent-foreground h-10 w-10">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-menu"
                  >
                    <line x1="4" x2="20" y1="12" y2="12" />
                    <line x1="4" x2="20" y1="6" y2="6" />
                    <line x1="4" x2="20" y1="18" y2="18" />
                  </svg>
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent className="w-full sm:w-2/3 md:w-1/2">
                <SheetHeader>
                  <SheetTitle>Menu</SheetTitle>
                  <SheetDescription>
                    Navigate through the application
                  </SheetDescription>
                </SheetHeader>
                <div className="flex flex-col space-y-4 mt-4">
                  {navigationItems.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`block px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-100 ${location.pathname === item.href ? 'bg-gray-100' : ''}`}
                    >
                      <div className="flex items-center">
                        <item.icon className="h-4 w-4 mr-2" />
                        <span>{item.name}</span>
                      </div>
                    </Link>
                  ))}
                  {user ? (
                    <>
                      <div className="border-t border-gray-200 my-2"></div>
                      <div className="px-4 py-2">
                        <span className="text-sm text-gray-600 block">
                          Logged in as {user.username}
                        </span>
                      </div>
                      <Button
                        onClick={() => logout()}
                        className="w-full justify-start gap-2"
                        variant="ghost"
                      >
                        <LogOut className="h-4 w-4" />
                        Sign Out
                      </Button>
                    </>
                  ) : (
                    <>
                      <div className="border-t border-gray-200 my-2"></div>
                      <Link
                        to="/login"
                        className="block px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-100"
                      >
                        <div className="flex items-center">
                          <LogIn className="h-4 w-4 mr-2" />
                          <span>Login</span>
                        </div>
                      </Link>
                      <Link
                        to="/register"
                        className="block px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-100"
                      >
                        <div className="flex items-center">
                          <UserPlus className="h-4 w-4 mr-2" />
                          <span>Register</span>
                        </div>
                      </Link>
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
