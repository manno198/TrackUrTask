import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, LayoutDashboard, Users, CheckSquare, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, email } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/employees', label: 'Employees', icon: Users },
    { path: '/tasks', label: 'Tasks', icon: CheckSquare },
  ];

  return (
    <nav className="bg-chartreuse border-b-[3px] border-ink sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-ink rounded-md flex items-center justify-center border-2 border-ink">
                <CheckSquare className="w-5 h-5 text-chartreuse" />
              </div>
              <span className="text-lg font-extrabold text-ink font-heading tracking-tight">TrackUrTask</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">
            {navLinks.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                data-testid={`nav-${label.toLowerCase()}`}
                className={`px-4 py-2 rounded-md text-sm font-bold uppercase tracking-wide transition-all duration-150 flex items-center gap-2 border-2 ${
                  isActive(path)
                    ? 'bg-ink text-chartreuse border-ink'
                    : 'text-ink border-transparent hover:border-ink'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            ))}
            {email && (
              <span className="font-mono text-xs uppercase text-ink/70 ml-3 hidden lg:inline">{email}</span>
            )}
            <button
              onClick={handleLogout}
              data-testid="logout-button"
              className="p-2 rounded-md border-2 border-transparent hover:border-ink text-ink transition-all ml-1"
              aria-label="Log out"
              title="Log out"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={() => setIsOpen(!isOpen)}
              data-testid="mobile-menu-button"
              className="p-2 rounded-md border-2 border-ink text-ink"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden border-t-[3px] border-ink bg-chartreuse">
          <div className="px-3 pt-3 pb-4 space-y-2">
            {navLinks.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                onClick={() => setIsOpen(false)}
                data-testid={`mobile-nav-${label.toLowerCase()}`}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-md text-sm font-bold uppercase tracking-wide border-2 transition-all ${
                  isActive(path)
                    ? 'bg-ink text-chartreuse border-ink'
                    : 'text-ink border-ink/20 hover:border-ink'
                }`}
              >
                <Icon className="w-5 h-5" />
                {label}
              </Link>
            ))}
            <button
              onClick={() => {
                setIsOpen(false);
                handleLogout();
              }}
              data-testid="mobile-logout-button"
              className="w-full flex items-center gap-2 px-3 py-2.5 rounded-md text-sm font-bold uppercase tracking-wide text-ink border-2 border-ink/20 hover:border-ink transition-all"
            >
              <LogOut className="w-5 h-5" />
              Log out
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
