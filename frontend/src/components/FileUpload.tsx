// // src/components/FileUpload.tsx

// 'use client'

// import React, { useState } from 'react'
// import axios from 'axios'
// import { Button } from '@/components/ui/button'
// import { Input } from '@/components/ui/input'

// interface FileUploadProps {
//   onUploadSuccess: (filePath: string) => void
// }

// const FileUpload: React.FC<FileUploadProps> = ({ onUploadSuccess }) => {
//   const [file, setFile] = useState<File | null>(null)
//   const [loading, setLoading] = useState(false)
//   const [message, setMessage] = useState('')

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files.length > 0) {
//       setFile(e.target.files[0])
//     }
//   }

//   const handleUpload = async () => {
//     if (!file) return
//     setLoading(true)
//     const formData = new FormData()
//     formData.append('file', file)

//     try {
//       const response = await axios.post('http://localhost:5000/upload', formData)
//       setMessage('Upload successful!')
//       onUploadSuccess(response.data.file_path)
//     } catch (error) {
//       setMessage('Upload failed')
//     } finally {
//       setLoading(false)
//     }
//   }

//   return (
//     <div className="space-y-4">
//       <Input type="file" accept=".csv" onChange={handleFileChange} />
//       <Button onClick={handleUpload} disabled={loading || !file}>
//         {loading ? 'Uploading...' : 'Upload CSV'}
//       </Button>
//       {message && <p className="text-sm text-gray-500">{message}</p>}
//     </div>
//   )
// }

// export default FileUpload

//-------------------------------------------------------------------------

'use client'

import React, { useState, useCallback } from 'react'
import axios from 'axios'
import { Button } from '@/components/ui/button'
import { Upload, FileCheck2, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FileUploadProps {
  onUploadSuccess: (filePath: string) => void
}

const FileUpload: React.FC<FileUploadProps> = ({ onUploadSuccess }) => {
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0])
      setStatus('idle')
      setMessage('')
    }
  }, [])

  const handleUpload = async () => {
    if (!file) return
    setLoading(true)
    setStatus('idle')
    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await axios.post('https://automl-lite.onrender.com/upload', formData)
      setMessage('File uploaded successfully!')
      setStatus('success')
      onUploadSuccess(response.data.file_path)
    } catch (error) {
      setMessage('Upload failed. Please try again.')
      setStatus('error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto px-4">
      <div className={cn(
        "border-2 border-dashed rounded-lg p-6 transition-all duration-200",
        "hover:border-primary/50 hover:bg-muted/50",
        status === 'success' && "border-green-500/50 bg-green-50/50",
        status === 'error' && "border-red-500/50 bg-red-50/50"
      )}>
        <div className="space-y-4">
          <div className="flex flex-col items-center justify-center gap-2">
            {status === 'success' ? (
              <FileCheck2 className="w-10 h-10 text-green-500" />
            ) : status === 'error' ? (
              <AlertCircle className="w-10 h-10 text-red-500" />
            ) : (
              <Upload className="w-10 h-10 text-muted-foreground" />
            )}
            <label 
              htmlFor="file-upload" 
              className="text-sm font-medium text-center cursor-pointer"
            >
              <span className="text-primary hover:underline">
                Choose a CSV file
              </span>
              {" "}or drag and drop
              <p className="text-xs text-muted-foreground mt-1">
                Supported format: CSV
              </p>
            </label>
          </div>
          
          <input
            id="file-upload"
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="hidden"
          />

          {file && (
            <div className="text-sm text-center space-y-2">
              <p className="font-medium text-foreground">
                Selected file: {file.name}
              </p>
              <Button 
                onClick={handleUpload} 
                disabled={loading} 
                className="w-full"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Uploading...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Upload className="w-4 h-4" />
                    <span>Upload CSV</span>
                  </div>
                )}
              </Button>
            </div>
          )}

          {message && (
            <p className={cn(
              "text-sm text-center",
              status === 'success' && "text-green-600",
              status === 'error' && "text-red-600"
            )}>
              {message}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default FileUpload