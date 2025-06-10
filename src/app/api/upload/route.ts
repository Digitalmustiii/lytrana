import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';

export async function POST(request: NextRequest) {
  console.log('📁 Upload API called');
  
  try {
    // Log the request details
    console.log('📋 Request content-type:', request.headers.get('content-type'));
    
    const data = await request.formData();
    console.log('📊 FormData parsed successfully');
    
    const file: File | null = data.get('file') as unknown as File;
    console.log('📄 File from formData:', file ? `${file.name} (${file.size} bytes)` : 'null');

    if (!file) {
      console.error('❌ No file received');
      return NextResponse.json({ error: 'No file received' }, { status: 400 });
    }

    // Validate file type
    if (!file.name.endsWith('.csv')) {
      console.error('❌ Invalid file type:', file.name);
      return NextResponse.json({ error: 'Only CSV files are allowed' }, { status: 400 });
    }

    // Validate file size (max 20MB)
    if (file.size > 20 * 1024 * 1024) {
      console.error('❌ File too large:', file.size);
      return NextResponse.json({ error: 'File size too large' }, { status: 400 });
    }

    console.log('✅ File validation passed');

    // Create unique filename with timestamp
    const timestamp = Date.now();
    const filename = `${timestamp}_${file.name}`;
    
    console.log('🏷️ Generated filename:', filename);
    console.log('☁️ Attempting to upload to Vercel Blob...');

    // Upload to Vercel Blob
    const blob = await put(filename, file, {
      access: 'public',
    });

    console.log('✅ Blob upload successful:', blob.url);

    const fileInfo = {
      id: timestamp.toString(),
      filename: file.name,
      originalName: file.name,
      size: file.size,
      uploadedAt: new Date().toISOString(),
      fileUrl: blob.url
    };

    console.log('📤 Returning success response');

    return NextResponse.json({
      message: 'File uploaded successfully',
      file: fileInfo,
      fileUrl: blob.url
    });

  } catch (error) {
    // Enhanced error logging
    console.error('💥 Upload error details:');
    console.error('Error message:', error instanceof Error ? error.message : 'Unknown error');
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    console.error('Full error object:', error);
    
    // Return detailed error for debugging (remove in production)
    return NextResponse.json(
      { 
        error: 'Failed to upload file',
        details: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  console.log('📡 Upload endpoint health check');
  return NextResponse.json({ 
    message: 'Upload endpoint ready',
    timestamp: new Date().toISOString(),
    env: {
      hasBlob: !!process.env.BLOB_READ_WRITE_TOKEN
    }
  });
}