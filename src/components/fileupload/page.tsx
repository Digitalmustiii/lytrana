import React, { useState, useCallback } from 'react';
import { Upload, CheckCircle, AlertCircle, File } from 'lucide-react';

export default function FileUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [error, setError] = useState('');
  const [debugInfo, setDebugInfo] = useState('');

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile?.type === 'text/csv' || droppedFile?.name.endsWith('.csv')) {
      setFile(droppedFile);
      setError('');
      setDebugInfo('');
    } else {
      setError('Please upload a CSV file only');
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile?.type === 'text/csv' || selectedFile?.name.endsWith('.csv')) {
      setFile(selectedFile);
      setError('');
      setDebugInfo('');
    } else {
      setError('Please upload a CSV file only');
    }
  };

  const uploadFile = async () => {
    if (!file) return;
    
    setUploading(true);
    setError('');
    setDebugInfo('Starting upload...');

    try {
      // Test endpoint first
      console.log('Testing upload endpoint...');
      const testResponse = await fetch('/api/upload', {
        method: 'GET',
      });
      
      if (!testResponse.ok) {
        throw new Error(`Endpoint test failed: ${testResponse.status}`);
      }
      
      const testData = await testResponse.json();
      console.log('Endpoint test result:', testData);
      setDebugInfo('Endpoint test passed, uploading file...');

      // Upload file
      console.log('Uploading file:', file.name, file.size, 'bytes');
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      console.log('Upload response status:', response.status);
      
      if (!response.ok) {
        // Try to get error details from response
        let errorMessage = `Upload failed with status ${response.status}`;
        try {
          const errorData = await response.json();
          console.error('Error response:', errorData);
          errorMessage = errorData.error || errorMessage;
          if (errorData.details) {
            errorMessage += ` - ${errorData.details}`;
          }
        } catch (parseError) {
          console.error('Could not parse error response:', parseError);
          const responseText = await response.text();
          console.error('Raw error response:', responseText);
          errorMessage += ` - Raw response: ${responseText.substring(0, 200)}`;
        }
        throw new Error(errorMessage);
      }

      const result = await response.json();
      console.log('Upload successful:', result);
      
      setUploaded(true);
      setFile(null);
      setDebugInfo('Upload completed successfully!');
      
      // You can add redirect logic here if needed
      
    } catch (uploadError: unknown) {
      console.error('Upload error:', uploadError);
      const errorMessage = uploadError instanceof Error ? uploadError.message : 'Upload failed. Please try again.';
      setError(errorMessage);
      setDebugInfo(`Error: ${errorMessage}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className="border-2 border-dashed border-gray-600 hover:border-green-400 bg-gray-800 rounded-xl p-8 text-center transition-colors duration-300"
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
              className="bg-blue-600 hover:bg-blue-700 px-6 py-3 text-white font-medium rounded-lg cursor-pointer hover:shadow-lg transition-all duration-200 inline-block"
            >
              Choose File
            </label>
          </>
        ) : (
          <div className="space-y-4">
            <File className="h-8 w-8 text-green-400 mx-auto" />
            <p className="text-white font-medium">{file.name}</p>
            <p className="text-gray-400 text-sm">{(file.size / 1024).toFixed(1)} KB</p>
            {!uploading && !uploaded && (
              <button
                onClick={uploadFile}
                className="bg-blue-600 hover:bg-blue-700 px-6 py-3 text-white font-medium rounded-lg hover:shadow-lg transition-all duration-200"
              >
                Upload File
              </button>
            )}
          </div>
        )}
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-900/50 border border-red-500 rounded-lg">
          <div className="flex items-center text-red-400 mb-2">
            <AlertCircle className="h-4 w-4 mr-2" />
            <span className="text-sm font-medium">Upload Error</span>
          </div>
          <p className="text-sm text-red-300">{error}</p>
        </div>
      )}

      {debugInfo && (
        <div className="mt-4 p-4 bg-blue-900/50 border border-blue-500 rounded-lg">
          <p className="text-sm text-blue-300">Debug: {debugInfo}</p>
        </div>
      )}

      {uploading && (
        <div className="mt-4 text-center">
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div className="bg-blue-500 h-2 rounded-full animate-pulse w-1/2"></div>
          </div>
          <p className="text-gray-400 text-sm mt-2">Uploading...</p>
        </div>
      )}

      {uploaded && (
        <div className="mt-4 text-center">
          <div className="flex items-center justify-center text-green-400 mb-2">
            <CheckCircle className="h-4 w-4 mr-2" />
            <span className="text-sm">File uploaded successfully!</span>
          </div>
        </div>
      )}
    </div>
  );
}