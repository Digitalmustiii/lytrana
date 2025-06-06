'use client';

import React from 'react';
import { useUser } from '@clerk/nextjs';
import { useQuery } from 'convex/react';
import { Upload, BarChart3, FileText, TrendingUp, Database, Clock } from 'lucide-react';
import Header from '@/components/Header';
import { api } from '../../../convex/_generated/api';

export default function Dashboard() {
  const { user } = useUser();
  const userId = user?.id;

  // Get real data from Convex
  const stats = useQuery(api.datasets.getUserStats, userId ? { userId } : "skip");
  const recentActivity = useQuery(api.datasets.getRecentActivity, userId ? { userId } : "skip");

  const quickActions = [
    {
      title: 'Upload Dataset',
      description: 'Import your CSV files',
      icon: Upload,
      href: '/upload',
      color: 'from-blue-500 to-purple-600'
    },
    {
      title: 'View Analytics',
      description: 'Explore your data insights',
      icon: BarChart3,
      href: '/analysis',
      color: 'from-green-500 to-teal-600'
    },
    {
      title: 'Create Report',
      description: 'Generate shareable reports',
      icon: FileText,
      href: '/upload',
      color: 'from-orange-500 to-red-600'
    }
  ];

  const formatTimeAgo = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    return 'Just now';
  };

  return (
    <div className="min-h-screen bg-[#161C40]">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Welcome back, {user?.firstName || 'User'}!
          </h1>
          <p className="text-gray-300">Here&apos;s what&apos;s happening with your data today.</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-[#1A2250] p-6 rounded-xl border border-gray-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Datasets</p>
                <p className="text-2xl font-bold text-white">{stats?.datasets || 0}</p>
              </div>
              <Database className="h-8 w-8 text-[#2EF273]" />
            </div>
          </div>
          <div className="bg-[#1A2250] p-6 rounded-xl border border-gray-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Analyses</p>
                <p className="text-2xl font-bold text-white">{stats?.analyses || 0}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-[#2EF273]" />
            </div>
          </div>
          <div className="bg-[#1A2250] p-6 rounded-xl border border-gray-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Reports</p>
                <p className="text-2xl font-bold text-white">{stats?.reports || 0}</p>
              </div>
              <FileText className="h-8 w-8 text-[#2EF273]" />
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {quickActions.map((action, index) => (
              <a
                key={index}
                href={action.href}
                className="group bg-[#1A2250] p-6 rounded-xl border border-gray-600 hover:border-[#2EF273] transition-all duration-300 transform hover:scale-101"
              >
                <div className={`w-12 h-12 bg-gradient-to-r ${action.color} rounded-lg flex items-center justify-center mb-4`}>
                  <action.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-[#2EF273] transition-colors">
                  {action.title}
                </h3>
                <p className="text-gray-400 text-sm">{action.description}</p>
              </a>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-[#1A2250] rounded-xl border border-gray-600 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white">Recent Activity</h2>
            <Clock className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {recentActivity && recentActivity.length > 0 ? (
              recentActivity.slice(0, 5).map((activity, index) => (
                <div key={index} className="flex items-center justify-between py-3 border-b border-gray-700 last:border-b-0">
                  <div>
                    <p className="text-white font-medium">{activity.name}</p>
                    <p className="text-sm text-gray-400">{activity.action}</p>
                  </div>
                  <span className="text-sm text-gray-500">{formatTimeAgo(activity.time)}</span>
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-center py-4">No recent activity. Upload your first dataset to get started!</p>
            )}
          </div>
          {recentActivity && recentActivity.length > 0 && (
            <div className="mt-4 text-center">
              <a href="/datasets" className="text-[#2EF273] hover:text-[#29D967] font-medium text-sm transition-colors">
                View All Activity →
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}