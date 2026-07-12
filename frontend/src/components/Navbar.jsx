import React from 'react';
import { Building2, User, LogOut, Bell } from 'lucide-react';

const Navbar = ({ onLogout }) => {
  return (
    <nav className="bg-banking-primary text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-3">
            <Building2 className="h-8 w-8" />
            <div>
              <h1 className="text-xl font-bold">12M Guard</h1>
              <p className="text-xs text-blue-200">Early Warning System</p>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            <a href="/dashboard" className="hover:text-blue-200 transition">Dashboard</a>
            <a href="/customer-analysis" className="hover:text-blue-200 transition">Customer Analysis</a>
            <a href="/prediction" className="hover:text-blue-200 transition">AI Prediction</a>
            <a href="/portfolio-analytics" className="hover:text-blue-200 transition">Portfolio</a>
            <a href="/reports" className="hover:text-blue-200 transition">Reports</a>
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            <button className="relative">
              <Bell className="h-5 w-5 hover:text-blue-200" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-xs rounded-full h-4 w-4 flex items-center justify-center">
                3
              </span>
            </button>
            <div className="flex items-center space-x-2">
              <User className="h-5 w-5" />
              <span className="text-sm">Admin</span>
            </div>
            <button 
              onClick={onLogout}
              className="flex items-center space-x-1 hover:text-blue-200 transition"
            >
              <LogOut className="h-5 w-5" />
              <span className="text-sm">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
