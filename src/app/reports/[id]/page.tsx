'use client';
import React, { useState } from 'react';
import { useQuery } from 'convex/react';
import { useParams } from 'next/navigation';
import { FileText, Calendar, Share2, Eye, EyeOff } from 'lucide-react';
import Header from '@/components/Header';
import ShareReports from '../../../components/ShareReport';
import { api } from '../../../../convex/_generated/api';
import { Id } from '../../../../convex/_generated/dataModel';

export default function ReportDetailPage() {
  const params = useParams();
  const reportId = params.id as string;
  const [showShareModal, setShowShareModal] = useState(false);
  
  const report = useQuery(api.reports.getReport, { id: reportId as Id<"reports"> });

  if (!report) {
    return (
      <div className="min-h-screen bg-[#161C40]">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-pulse text-[#2EF273]">Loading report...</div>
          </div>
        </div>
      </div>
    );
  }

  const handlePublicToggle = (isPublic: boolean) => {
    console.log('Updating report visibility:', { reportId, isPublic });
    // TODO: Implement API call to update report visibility
    // await updateReport({ id: reportId, isPublic });
  };

  return (
    <div className="min-h-screen bg-[#161C40]">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">{report.title}</h1>
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {new Date(report.createdAt).toLocaleDateString()}
              </div>
              <div className="flex items-center gap-1">
                {report.isPublic ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                {report.isPublic ? 'Public' : 'Private'}
              </div>
            </div>
          </div>
          <button 
            onClick={() => setShowShareModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#2EF273] text-black rounded-lg hover:bg-[#25d063] transition-colors"
          >
            <Share2 className="h-4 w-4" />
            Share
          </button>
        </div>

        {/* Summary */}
        <div className="bg-[#1A2250] rounded-xl border border-gray-600 p-6 mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">Summary</h2>
          <p className="text-gray-300 leading-relaxed">{report.content.summary}</p>
        </div>

        {/* Charts */}
        {report.content.charts && report.content.charts.length > 0 && (
          <div className="bg-[#1A2250] rounded-xl border border-gray-600 p-6 mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">Charts</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {report.content.charts.map((chart, i) => (
                <div key={i} className="bg-[#161C40] p-4 rounded-lg border border-gray-700">
                  <h3 className="text-white font-medium mb-2">{chart.title}</h3>
                  <div className="text-sm text-gray-400 mb-2">Type: {chart.type}</div>
                  <div className="bg-[#1A2250] p-3 rounded text-xs text-gray-300">
                    Chart data available
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Insights */}
        {report.content.insights && report.content.insights.length > 0 && (
          <div className="bg-[#1A2250] rounded-xl border border-gray-600 p-6">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="h-5 w-5 text-[#2EF273]" />
              <h2 className="text-xl font-semibold text-white">Key Insights</h2>
            </div>
            <div className="space-y-3">
              {report.content.insights.map((insight, i) => (
                <div key={i} className="bg-[#161C40] p-4 rounded-lg border border-gray-700">
                  <p className="text-gray-300">{insight}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Share Modal */}
      <ShareReports
        reportId={reportId}
        reportTitle={report.title}
        reportSummary={report.content.summary || "Check out this analysis report"}
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        onPublicToggle={handlePublicToggle}
        reportData={{
          createdAt: report.createdAt.toString(),
          isPublic: report.isPublic,
          content: report.content
        }}
      />
    </div>
  );
}