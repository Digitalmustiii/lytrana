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

  const uploadFile = async () => {
    if (!file || !user) return;
    
    setUploading(true);
    setError('');

    try {
      console.log('🚀 Starting upload process...');

      // Upload file to your API
      const formData = new FormData();
      formData.append('file', file);

      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!uploadResponse.ok) {
        throw new Error('File upload failed');
      }

      const uploadResult = await uploadResponse.json();
      console.log('✅ Upload successful:', uploadResult);

      // Create dataset record in Convex with the returned data
      const datasetId = await createDataset({
        name: file.name.replace('.csv', ''),
        fileName: file.name,
        fileSize: file.size,
        uploadedBy: user.id,
        rowCount: uploadResult.rowCount || 0,
        columnCount: uploadResult.columnCount || 0,
        columns: uploadResult.columns || [],
        fileUrl: uploadResult.fileUrl,
      });

      console.log('✅ Dataset created in Convex:', datasetId);

      // Trigger analysis
      const analyzeResponse = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          datasetId,
          userId: user.id,
          csvData: uploadResult.csvData
        }),
      });

      if (!analyzeResponse.ok) {
        console.warn('⚠️ Analysis failed, but upload succeeded');
        // Continue anyway - analysis might be processed later
      } else {
        const analysisResult = await analyzeResponse.json();
        console.log('✅ Analysis completed:', analysisResult);
      }

      setUploaded(true);
      setFile(null);
      
      // Redirect to analysis page after 2 seconds
      console.log('🔄 Redirecting to analysis page...');
      setTimeout(() => {
        router.push(`/analysis/${datasetId}`);
      }, 2000);

    } catch (error) {
      console.error('💥 Upload failed:', error);
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