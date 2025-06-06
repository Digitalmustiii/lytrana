'use client';
import React from 'react';
import { useQuery } from 'convex/react';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';
import { FileText, Clock, Eye } from 'lucide-react';
import Header from '@/components/Header';
import { api } from '../../../convex/_generated/api';

export default function ReportsPage() {
  const { user } = useUser();
  const reports = useQuery(api.reports.getUserReports, 
    user?.id ? { userId: user.id } : "skip"
  );

  if (!reports) {
    return (
      <div className="min-h-screen bg-[#161C40]">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-pulse text-[#2EF273]">Loading reports...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#161C40]">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">My Reports</h1>
          <p className="text-gray-300">View and manage your analysis reports</p>
        </div>

        {reports.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">No reports yet</h3>
            <p className="text-gray-400">Create your first report by analyzing a dataset</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reports.map((report) => (
              <Link key={report._id} href={`/reports/${report._id}`}>
                <div className="bg-[#1A2250] p-6 rounded-xl border border-gray-600 hover:border-[#2EF273] transition-colors cursor-pointer">
                  <div className="flex items-center justify-between mb-4">
                    <FileText className="h-6 w-6 text-[#2EF273]" />
                    {report.isPublic && <Eye className="h-4 w-4 text-gray-400" />}
                  </div>
                  
                  <h3 className="text-lg font-semibold text-white mb-2 truncate">
                    {report.title}
                  </h3>
                  
                  <p className="text-sm text-gray-400 mb-4 line-clamp-2">
                    {report.content.summary}
                  </p>
                  
                  <div className="flex items-center text-xs text-gray-500">
                    <Clock className="h-3 w-3 mr-1" />
                    {new Date(report.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}