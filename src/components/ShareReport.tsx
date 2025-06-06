'use client';
import React, { useState } from 'react';
import { Share2, Copy, Mail, Check, X, MessageCircle, Linkedin, Download } from 'lucide-react';

interface ShareReportsProps {
  reportId: string;
  reportTitle: string;
  reportSummary?: string;
  isOpen: boolean;
  onClose: () => void;
  onPublicToggle: (isPublic: boolean) => void;
  reportData?: {
    createdAt: string;
    isPublic: boolean;
    content: {
      summary: string;
      insights?: string[];
      charts?: Array<{ title: string; type: string; }>;
    };
  };
}

export default function ShareReports({ 
  reportId, 
  reportTitle, 
  reportSummary = "Check out this analysis report",
  isOpen, 
  onClose,
  onPublicToggle,
  reportData
}: ShareReportsProps) {
  const [copied, setCopied] = useState(false);
  const [isPublic, setIsPublic] = useState(false);

  if (!isOpen) return null;

  const shareUrl = `${window.location.origin}/reports/${reportId}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy link:', error);
    }
  };

  const handlePublicToggle = () => {
    const newIsPublic = !isPublic;
    setIsPublic(newIsPublic);
    onPublicToggle(newIsPublic);
  };

  const shareViaEmail = () => {
    const subject = `Report: ${reportTitle}`;
    const body = `Hi,\n\nI wanted to share this analysis report with you:\n\n${reportTitle}\n\n${reportSummary}\n\nView the full report here: ${shareUrl}\n\nBest regards`;
    const mailtoUrl = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailtoUrl, '_blank');
  };

  const shareViaWhatsApp = () => {
    const text = `${reportTitle}\n\n${reportSummary}\n\nView report: ${shareUrl}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, '_blank');
  };

  const shareViaLinkedIn = () => {
    const encodedUrl = encodeURIComponent(shareUrl);
    const encodedTitle = encodeURIComponent(reportTitle);
    const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}&title=${encodedTitle}`;
    window.open(linkedinUrl, '_blank');
  };

  const generatePDF = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      const insights = reportData?.content.insights || [];
      const charts = reportData?.content.charts || [];
      const createdDate = reportData ? new Date(parseInt(reportData.createdAt)).toLocaleDateString() : '';
      const privacy = reportData?.isPublic ? 'Public' : 'Private';
      
      printWindow.document.write(`
        <html>
          <head>
            <title>${reportTitle}</title>
            <style>
              body { 
                font-family: Arial, sans-serif; 
                margin: 20px; 
                line-height: 1.6;
                color: #333;
              }
              h1 { 
                color: #161C40; 
                border-bottom: 3px solid #2EF273;
                padding-bottom: 10px;
              }
              h2 { 
                color: #1A2250; 
                margin-top: 30px;
              }
              .header-info {
                display: flex;
                gap: 20px;
                margin: 10px 0 30px 0;
                font-size: 14px;
                color: #666;
              }
              .summary { 
                margin: 20px 0; 
                padding: 20px; 
                background: #f8f9fa; 
                border-radius: 8px;
                border-left: 4px solid #2EF273;
              }
              .insight {
                margin: 15px 0;
                padding: 15px;
                background: #f5f5f5;
                border-radius: 6px;
                border-left: 3px solid #1A2250;
              }
              .chart-item {
                margin: 10px 0;
                padding: 10px;
                background: #e9ecef;
                border-radius: 4px;
              }
              .footer {
                margin-top: 40px;
                padding-top: 20px;
                border-top: 1px solid #ddd;
                font-size: 12px;
                color: #666;
              }
              @media print {
                body { margin: 0; }
                .no-print { display: none; }
              }
            </style>
          </head>
          <body>
            <h1>${reportTitle}</h1>
            <div class="header-info">
              <span>📅 ${createdDate}</span>
              <span>🔒 ${privacy}</span>
            </div>
            
            <div class="summary">
              <h2>📋 Summary</h2>
              <p>${reportData?.content.summary || reportSummary}</p>
            </div>
            
            ${charts.length > 0 ? `
              <div>
                <h2>📊 Charts</h2>
                ${charts.map(chart => `
                  <div class="chart-item">
                    <strong>${chart.title}</strong><br>
                    <small>Type: ${chart.type}</small>
                  </div>
                `).join('')}
              </div>
            ` : ''}
            
            ${insights.length > 0 ? `
              <div>
                <h2>💡 Key Insights</h2>
                ${insights.map((insight, i) => `
                  <div class="insight">
                    <strong>Insight ${i + 1}:</strong><br>
                    ${insight}
                  </div>
                `).join('')}
              </div>
            ` : ''}
            
            <div class="footer">
              <p>Generated from: ${shareUrl}</p>
              <p>Report ID: ${reportId}</p>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    } else {
      alert('Please allow popups to download PDF');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#1A2250] rounded-xl border border-gray-600 p-6 w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Share2 className="h-5 w-5 text-[#2EF273]" />
            <h2 className="text-xl font-semibold text-white">Share Report</h2>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-gray-700 rounded-lg">
            <X className="h-5 w-5 text-gray-400" />
          </button>
        </div>

        {/* Report Info */}
        <div className="mb-6">
          <h3 className="text-white font-medium mb-1">{reportTitle}</h3>
          <p className="text-gray-400 text-sm">{reportSummary}</p>
        </div>

        {/* Public Toggle */}
        <div className="mb-6">
          <div className="flex items-center justify-between p-3 bg-[#161C40] rounded-lg border border-gray-700">
            <div>
              <p className="text-white text-sm font-medium">Public Access</p>
              <p className="text-gray-400 text-xs">Anyone with the link can view</p>
            </div>
            <button
              onClick={handlePublicToggle}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                isPublic ? 'bg-[#2EF273]' : 'bg-gray-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isPublic ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Copy Link */}
        <div className="mb-6">
          <div className="flex gap-2">
            <input
              type="text"
              value={shareUrl}
              readOnly
              className="flex-1 px-3 py-2 bg-[#161C40] border border-gray-600 rounded-lg text-gray-300 text-sm"
            />
            <button
              onClick={handleCopyLink}
              className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                copied ? 'bg-green-600 text-white' : 'bg-[#2EF273] text-black hover:bg-[#25d063]'
              }`}
            >
              {copied ? <><Check className="h-4 w-4" />Copied</> : <><Copy className="h-4 w-4" />Copy</>}
            </button>
          </div>
        </div>

        {/* Share Buttons */}
        <div className="mb-6 grid grid-cols-2 gap-3">
          <button onClick={shareViaEmail} className="flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium">
            <Mail className="h-4 w-4" />Email
          </button>
          <button onClick={shareViaWhatsApp} className="flex items-center gap-2 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium">
            <MessageCircle className="h-4 w-4" />WhatsApp
          </button>
          <button onClick={shareViaLinkedIn} className="flex items-center gap-2 px-3 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-sm font-medium">
            <Linkedin className="h-4 w-4" />LinkedIn
          </button>
          <button onClick={generatePDF} className="flex items-center gap-2 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium">
            <Download className="h-4 w-4" />PDF
          </button>
        </div>

        {/* Footer */}
        <div className="flex justify-end">
          <button onClick={onClose} className="px-4 py-2 text-gray-400 hover:text-white text-sm">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}