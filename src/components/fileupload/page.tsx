'use client';

import React, { useState, useCallback } from 'react';
import { Upload, CheckCircle, AlertCircle, File } from 'lucide-react';
import { useUser } from '@clerk/nextjs';
import { useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { useRouter } from 'next/navigation';

export default function FileUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [error, setError] = useState('');
  
  const { user } = useUser();
  const router = useRouter();
  const createDataset = useMutation(api.datasets.createDataset);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile?.type === 'text/csv') {
      setFile(droppedFile);
      setError('');
    } else {
      setError('Please upload a CSV file only');
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile?.type === 'text/csv') {
      setFile(selectedFile);
      setError('');
    } else {
      setError('Please upload a CSV file only');
    }
  };

  const parseCSVHeaders = (csvText: string) => {
    const lines = csvText.split('\n');
    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
    const dataRows = lines.slice(1).filter(line => line.trim());
    
    // Detect column types from first few rows
    const columns = headers.map(header => {
      const values = dataRows.slice(0, 10).map(row => {
        const cols = row.split(',');
        const index = headers.indexOf(header);
        return cols[index]?.trim().replace(/"/g, '');
      }).filter(v => v && v !== '');

      let type = 'string';
      if (values.length > 0) {
        const isNumeric = values.every(v => !isNaN(Number(v)) && v !== '');
        if (isNumeric) type = 'number';
      }

      return {
        name: header,
        type,
        nullable: false,
      };
    });

    return { columns, rowCount: dataRows.length };
  };

  const uploadFile = async () => {
    if (!file || !user) return;
    
    setUploading(true);
    setError('');

    try {
      // Read file content for parsing
      const fileText = await file.text();
      const { columns, rowCount } = parseCSVHeaders(fileText);

      // Upload to your existing API endpoint
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('File upload failed');
      }

      const { fileUrl } = await response.json();

      // Create dataset record in Convex
      const datasetId = await createDataset({
        name: file.name.replace('.csv', ''),
        fileName: file.name,
        fileSize: file.size,
        uploadedBy: user.id,
        rowCount,
        columnCount: columns.length,
        columns,
        fileUrl,
      });

      // Trigger analysis
      const analyzeResponse = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          datasetId,
          userId: user.id,
          csvData: fileText
        }),
      });

      if (!analyzeResponse.ok) {
        console.warn('Analysis failed, but upload succeeded');
      }

      setUploaded(true);
      setFile(null);
      
      // Redirect to analysis page after 2 seconds
      setTimeout(() => {
        router.push(`/analysis/${datasetId}`);
      }, 2000);

    } catch {
      setError('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className="border-2 border-dashed border-gray-600 hover:border-[#2EF273] bg-[#1A2250] rounded-xl p-8 text-center transition-colors duration-300"
      >
        {!file ? (
          <>
            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-white font-medium mb-2">Drop your CSV file here</p>
            <p className="text-gray-400 text-sm mb-4">or click to browse</p>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileSelect}
              className="hidden"
              id="file-input"
            />
            <label
              htmlFor="file-input"
              className="gradient-brand px-6 py-3 text-white font-medium rounded-lg cursor-pointer hover:shadow-lg transition-all duration-200 inline-block"
            >
              Choose File
            </label>
          </>
        ) : (
          <div className="space-y-4">
            <File className="h-8 w-8 text-[#2EF273] mx-auto" />
            <p className="text-white font-medium">{file.name}</p>
            <p className="text-gray-400 text-sm">{(file.size / 1024).toFixed(1)} KB</p>
            {!uploading && !uploaded && (
              <button
                onClick={uploadFile}
                disabled={!user}
                className="gradient-brand px-6 py-3 text-white font-medium rounded-lg hover:shadow-lg transition-all duration-200 disabled:opacity-50"
              >
                {user ? 'Upload File' : 'Please sign in to upload'}
              </button>
            )}
          </div>
        )}
      </div>

      {error && (
        <div className="mt-4 flex items-center text-red-400">
          <AlertCircle className="h-4 w-4 mr-2" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      {uploading && (
        <div className="mt-4 text-center">
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div className="bg-[#2EF273] h-2 rounded-full animate-pulse w-1/2"></div>
          </div>
          <p className="text-gray-400 text-sm mt-2">Uploading and analyzing...</p>
        </div>
      )}

      {uploaded && (
        <div className="mt-4 text-center">
          <div className="flex items-center justify-center text-[#2EF273] mb-2">
            <CheckCircle className="h-4 w-4 mr-2" />
            <span className="text-sm">File uploaded successfully!</span>
          </div>
          <p className="text-gray-400 text-sm">Redirecting to analysis...</p>
        </div>
      )}
    </div>
  );
}