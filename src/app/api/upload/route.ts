import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  console.log('📁 Upload API called');
  
  try {
    const data = await request.formData();
    const file: File | null = data.get('file') as unknown as File;

    if (!file) {
      console.error('❌ No file received');
      return NextResponse.json({ error: 'No file received' }, { status: 400 });
    }

    console.log('📄 File received:', file.name, `${file.size} bytes`);

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

    // Read file content as text
    const csvText = await file.text();
    console.log('✅ File content read successfully, length:', csvText.length);

    // Parse CSV headers for metadata
    const lines = csvText.split('\n').filter(line => line.trim());
    const headers = lines[0] ? lines[0].split(',').map(h => h.trim().replace(/"/g, '')) : [];
    const dataRows = lines.slice(1);

    console.log('📊 CSV parsed - Headers:', headers.length, 'Rows:', dataRows.length);

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

    const timestamp = Date.now();
    
    // Store CSV data as base64 for retrieval
    const fileUrl = `data:text/csv;base64,${Buffer.from(csvText).toString('base64')}`;

    const fileInfo = {
      id: timestamp.toString(),
      filename: file.name,
      originalName: file.name,
      size: file.size,
      uploadedAt: new Date().toISOString(),
      rowCount: dataRows.length,
      columnCount: headers.length,
      headers: headers,
      columns: columns,
      fileUrl: fileUrl,
      csvData: csvText
    };

    console.log('✅ Returning success response with columns:', columns);

    return NextResponse.json({
      message: 'File uploaded successfully',
      file: fileInfo,
      fileUrl: fileUrl,
      csvData: csvText,
      columns: columns,
      rowCount: dataRows.length,
      columnCount: headers.length
    });

  } catch (error) {
    console.error('💥 Upload error:', error);
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
    status: 'healthy'
  });
}