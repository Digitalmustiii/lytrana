import Header from '@/components/Header'
import FileUpload from '@/components/fileupload/page'

export default function UploadPage() {
  return (
    <div className="min-h-screen bg-[#161C40]">
      <Header />
      <div className="py-8">
        <h1 className="text-3xl font-bold text-white text-center mb-8">
          Upload Your Dataset
        </h1>
        <FileUpload />
      </div>
    </div>
  )
}