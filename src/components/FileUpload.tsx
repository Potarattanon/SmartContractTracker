import React, { useState, useRef } from 'react'
import { Upload, X, FileText, AlertCircle, CheckCircle, Loader2, Calendar, Sparkles } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { useAIProcessing } from '../hooks/useAIProcessing'
import { DOCUMENT_TYPE_LABELS } from '../lib/supabase'

interface FileUploadProps {
  onUploadSuccess?: (document: any) => void
  onClose?: () => void
}

interface UploadFile {
  file: File
  id: string
  progress: number
  status: 'pending' | 'uploading' | 'processing' | 'success' | 'error'
  error?: string
  preview?: string
  documentId?: string
}

export function FileUpload({ onUploadSuccess, onClose }: FileUploadProps) {
  const { user } = useAuth()
  const { processDocument, processingStatus } = useAIProcessing()
  const [files, setFiles] = useState<UploadFile[]>([])
  const [isDragOver, setIsDragOver] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Notification settings
  const [notificationSettings, setNotificationSettings] = useState({
    type: 'days' as 'days' | 'weeks' | 'months' | 'custom',
    value: 7,
    customDate: ''
  })

  const acceptedTypes = ['application/pdf', 'image/png']
  const maxFileSize = 10 * 1024 * 1024 // 10MB

  const validateFile = (file: File): string | null => {
    if (!acceptedTypes.includes(file.type)) {
      return 'รองรับเฉพาะไฟล์ PDF และ PNG เท่านั้น'
    }
    if (file.size > maxFileSize) {
      return 'ขนาดไฟล์ต้องไม่เกิน 10MB'
    }
    return null
  }

  const generateFileId = () => Math.random().toString(36).substring(2, 15)

  const createFilePreview = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      if (file.type === 'image/png') {
        const reader = new FileReader()
        reader.onload = (e) => resolve(e.target?.result as string)
        reader.readAsDataURL(file)
      } else {
        resolve('/pdf-icon.svg')
      }
    })
  }

  const addFiles = async (newFiles: FileList | File[]) => {
    const fileArray = Array.from(newFiles)
    const validFiles: UploadFile[] = []

    for (const file of fileArray) {
      const error = validateFile(file)
      const preview = await createFilePreview(file)
      
      validFiles.push({
        file,
        id: generateFileId(),
        progress: 0,
        status: error ? 'error' : 'pending',
        error,
        preview
      })
    }

    setFiles(prev => [...prev, ...validFiles])
  }

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id))
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    const droppedFiles = e.dataTransfer.files
    if (droppedFiles.length > 0) {
      addFiles(droppedFiles)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files
    if (selectedFiles && selectedFiles.length > 0) {
      addFiles(selectedFiles)
    }
  }

  const uploadFileToStorage = async (uploadFile: UploadFile): Promise<string> => {
    if (!user) throw new Error('ไม่พบข้อมูลผู้ใช้')

    const fileExt = uploadFile.file.name.split('.').pop()
    const fileName = `${user.id}/${Date.now()}.${fileExt}`

    const { data, error } = await supabase.storage
      .from('documents')
      .upload(fileName, uploadFile.file, {
        cacheControl: '3600',
        upsert: false
      })

    if (error) throw error
    return data.path
  }

  const calculateNotificationDays = () => {
    switch (notificationSettings.type) {
      case 'days':
        return [notificationSettings.value]
      case 'weeks':
        return [notificationSettings.value * 7]
      case 'months':
        return [notificationSettings.value * 30]
      case 'custom':
        if (notificationSettings.customDate) {
          const customDate = new Date(notificationSettings.customDate)
          const today = new Date()
          const diffTime = customDate.getTime() - today.getTime()
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
          return diffDays > 0 ? [diffDays] : [1]
        }
        return [7]
      default:
        return [7]
    }
  }

  const handleUpload = async () => {
    if (!user || files.length === 0) return

    setIsUploading(true)

    try {
      // Create or update user settings
      const notificationDays = calculateNotificationDays()
      
      const { data: existingSettings } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (existingSettings) {
        await supabase
          .from('user_settings')
          .update({
            notification_days_before: notificationDays,
            email_notifications: true,
            browser_notifications: true
          })
          .eq('user_id', user.id)
      } else {
        await supabase
          .from('user_settings')
          .insert({
            user_id: user.id,
            notification_days_before: notificationDays,
            email_notifications: true,
            browser_notifications: true
          })
      }

      // Process each file
      for (const uploadFile of files) {
        if (uploadFile.status !== 'pending') continue

        try {
          // Step 1: Upload to storage
          setFiles(prev => prev.map(f => 
            f.id === uploadFile.id 
              ? { ...f, status: 'uploading' as const, progress: 20 }
              : f
          ))

          const filePath = await uploadFileToStorage(uploadFile)

          // Step 2: Create database record with temporary document type
          setFiles(prev => prev.map(f => 
            f.id === uploadFile.id 
              ? { ...f, progress: 40 }
              : f
          ))

          const title = uploadFile.file.name.split('.')[0].replace(/[_-]/g, ' ')

          const { data: document, error: dbError } = await supabase
            .from('documents')
            .insert({
              user_id: user.id,
              title: title,
              description: `อัปโหลดโดยอัตโนมัติจากไฟล์ ${uploadFile.file.name}`,
              file_name: uploadFile.file.name,
              file_path: filePath,
              file_type: uploadFile.file.type === 'application/pdf' ? 'PDF' : 'PNG',
              file_size: uploadFile.file.size,
              document_type: 'license', // ค่าเริ่มต้น AI จะเปลี่ยนให้ใหม่
              expiry_date: null // จะถูกตั้งค่าโดย AI
            })
            .select()
            .single()

          if (dbError) throw dbError

          // Step 3: Process with AI (AI will determine document type automatically)
          setFiles(prev => prev.map(f => 
            f.id === uploadFile.id 
              ? { ...f, status: 'processing' as const, progress: 60, documentId: document.id }
              : f
          ))

          const aiResult = await processDocument(
            document.id,
            filePath,
            uploadFile.file.type === 'application/pdf' ? 'PDF' : 'PNG',
            'auto' // ส่งค่า 'auto' ให้ AI ตัดสินใจเอง
          )

          if (aiResult.success) {
            setFiles(prev => prev.map(f => 
              f.id === uploadFile.id 
                ? { ...f, status: 'success' as const, progress: 100 }
                : f
            ))

            if (onUploadSuccess) {
              onUploadSuccess(document)
            }
          } else {
            // AI failed but file uploaded successfully
            setFiles(prev => prev.map(f => 
              f.id === uploadFile.id 
                ? { 
                    ...f, 
                    status: 'success' as const, 
                    progress: 100,
                    error: `อัปโหลดสำเร็จ แต่ AI ไม่สามารถประมวลผลได้: ${aiResult.error}`
                  }
                : f
            ))

            if (onUploadSuccess) {
              onUploadSuccess(document)
            }
          }

        } catch (error) {
          console.error('Upload error:', error)
          setFiles(prev => prev.map(f => 
            f.id === uploadFile.id 
              ? { 
                  ...f, 
                  status: 'error' as const, 
                  error: error instanceof Error ? error.message : 'เกิดข้อผิดพลาดในการอัปโหลด'
                }
              : f
          ))
        }
      }
    } finally {
      setIsUploading(false)
    }
  }

  const hasValidFiles = files.some(f => f.status === 'pending' && !f.error)
  const allFilesProcessed = files.length > 0 && files.every(f => f.status === 'success' || f.status === 'error')

  const getNotificationText = () => {
    switch (notificationSettings.type) {
      case 'days':
        return `${notificationSettings.value} วันก่อนหมดอายุ`
      case 'weeks':
        return `${notificationSettings.value} สัปดาห์ก่อนหมดอายุ`
      case 'months':
        return `${notificationSettings.value} เดือนก่อนหมดอายุ`
      case 'custom':
        return notificationSettings.customDate 
          ? `วันที่ ${new Date(notificationSettings.customDate).toLocaleDateString('th-TH')}`
          : 'เลือกวันที่'
      default:
        return '7 วันก่อนหมดอายุ'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'uploading':
        return <Loader2 className="h-5 w-5 text-blue-600 animate-spin" />
      case 'processing':
        return <Sparkles className="h-5 w-5 text-purple-600 animate-pulse" />
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-600" />
      default:
        return null
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'uploading':
        return 'กำลังอัปโหลด...'
      case 'processing':
        return 'AI กำลังวิเคราะห์และจัดประเภท...'
      case 'success':
        return 'สำเร็จ'
      case 'error':
        return 'ผิดพลาด'
      default:
        return 'รอการประมวลผล'
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-strong max-w-4xl w-full max-h-[95vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">อัปโหลดเอกสาร</h2>
            <p className="text-sm text-gray-600 mt-1">เพิ่มเอกสารใหม่เข้าสู่ระบบ</p>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all duration-200"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(95vh - 200px)' }}>
          {/* AI Document Classification Info */}
          <div className="mb-6">
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-xl p-5">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                  <Sparkles className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-purple-900">AI จัดประเภทเอกสารอัตโนมัติ</h3>
                  <p className="text-sm text-purple-700">ระบบ AI จะวิเคราะห์และจัดประเภทเอกสารให้โดยอัตโนมัติ</p>
                </div>
              </div>

              {/* Document Type Examples */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                {Object.entries(DOCUMENT_TYPE_LABELS).map(([value, label]) => (
                  <div
                    key={value}
                    className="p-3 bg-white/70 rounded-lg border border-purple-100 text-center"
                  >
                    <span className="text-sm font-semibold text-purple-800">{label}</span>
                  </div>
                ))}
              </div>

              <div className="p-3 bg-white/50 rounded-lg border border-purple-100">
                <p className="text-sm text-purple-800">
                  <strong>💡 เคล็ดลับ:</strong> AI จะอ่านเนื้อหาในเอกสารและจัดประเภทให้อัตโนมัติ พร้อมดึงวันหมดอายุและข้อมูลสำคัญอื่นๆ
                </p>
              </div>
            </div>
          </div>

          {/* Notification Settings */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-blue-600" />
              <span>ตั้งค่าการแจ้งเตือน</span>
            </h3>
            
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
              <p className="text-sm text-blue-800 font-medium mb-3">
                เลือกเวลาที่ต้องการให้แจ้งเตือนก่อนเอกสารหมดอายุ
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                <button
                  onClick={() => setNotificationSettings({ type: 'days', value: 7, customDate: '' })}
                  className={`p-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    notificationSettings.type === 'days' && notificationSettings.value === 7
                      ? 'bg-blue-600 text-white shadow-soft'
                      : 'bg-white text-blue-600 border border-blue-200 hover:bg-blue-50'
                  }`}
                >
                  1 สัปดาห์
                </button>
                
                <button
                  onClick={() => setNotificationSettings({ type: 'months', value: 1, customDate: '' })}
                  className={`p-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    notificationSettings.type === 'months' && notificationSettings.value === 1
                      ? 'bg-blue-600 text-white shadow-soft'
                      : 'bg-white text-blue-600 border border-blue-200 hover:bg-blue-50'
                  }`}
                >
                  1 เดือน
                </button>
                
                <button
                  onClick={() => setNotificationSettings({ type: 'months', value: 3, customDate: '' })}
                  className={`p-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    notificationSettings.type === 'months' && notificationSettings.value === 3
                      ? 'bg-blue-600 text-white shadow-soft'
                      : 'bg-white text-blue-600 border border-blue-200 hover:bg-blue-50'
                  }`}
                >
                  3 เดือน
                </button>
                
                <button
                  onClick={() => setNotificationSettings({ type: 'custom', value: 0, customDate: '' })}
                  className={`p-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    notificationSettings.type === 'custom'
                      ? 'bg-blue-600 text-white shadow-soft'
                      : 'bg-white text-blue-600 border border-blue-200 hover:bg-blue-50'
                  }`}
                >
                  กำหนดเอง
                </button>
              </div>

              {/* Custom Date Input */}
              {notificationSettings.type === 'custom' && (
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-blue-800 mb-2">
                    เลือกวันที่ต้องการแจ้งเตือน
                  </label>
                  <input
                    type="date"
                    value={notificationSettings.customDate}
                    onChange={(e) => setNotificationSettings(prev => ({ ...prev, customDate: e.target.value }))}
                    className="w-full px-4 py-3 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  />
                </div>
              )}

              {/* Custom Value Input for Days/Weeks/Months */}
              {notificationSettings.type !== 'custom' && (
                <div className="flex items-center space-x-3">
                  <label className="text-sm font-semibold text-blue-800">
                    จำนวน:
                  </label>
                  <input
                    type="number"
                    min="1"
                    max={notificationSettings.type === 'days' ? 365 : notificationSettings.type === 'weeks' ? 52 : 12}
                    value={notificationSettings.value}
                    onChange={(e) => setNotificationSettings(prev => ({ ...prev, value: parseInt(e.target.value) || 1 }))}
                    className="w-20 px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-center"
                  />
                  <span className="text-sm font-semibold text-blue-800">
                    {notificationSettings.type === 'days' ? 'วัน' : 
                     notificationSettings.type === 'weeks' ? 'สัปดาห์' : 'เดือน'}
                  </span>
                </div>
              )}

              <div className="mt-3 p-3 bg-white rounded-lg border border-blue-200">
                <p className="text-sm text-blue-800">
                  <strong>การแจ้งเตือน:</strong> {getNotificationText()}
                </p>
                <p className="text-xs text-blue-600 mt-1">
                  จะส่งการแจ้งเตือนทางอีเมลและแสดงในเว็บไซต์
                </p>
              </div>
            </div>
          </div>

          {/* File Upload Area */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">เลือกไฟล์เอกสาร</h3>
            
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`
                border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300
                ${isDragOver 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }
              `}
            >
              <div className="flex flex-col items-center space-y-4">
                <div className={`
                  w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300
                  ${isDragOver ? 'bg-blue-100' : 'bg-gray-100'}
                `}>
                  <Upload className={`h-8 w-8 ${isDragOver ? 'text-blue-600' : 'text-gray-400'}`} />
                </div>
                
                <div>
                  <p className="text-lg font-semibold text-gray-900 mb-2">
                    ลากไฟล์มาวางที่นี่
                  </p>
                  <p className="text-sm text-gray-600 mb-4">หรือ</p>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-gradient-to-r from-blue-600 to-teal-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-teal-700 transition-all duration-200 shadow-soft hover:shadow-medium transform hover:-translate-y-0.5 font-semibold"
                  >
                    เลือกไฟล์
                  </button>
                </div>
                
                <div className="text-xs text-gray-500 space-y-1">
                  <p>รองรับไฟล์: PDF, PNG</p>
                  <p>ขนาดไฟล์สูงสุด: 10MB</p>
                  <p className="text-purple-600 font-semibold flex items-center justify-center space-x-1">
                    <Sparkles className="h-3 w-3" />
                    <span>AI จะวิเคราะห์และจัดประเภทเอกสารให้อัตโนมัติ</span>
                  </p>
                </div>
              </div>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".pdf,.png"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>

          {/* File List */}
          {files.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">ไฟล์ที่เลือก</h3>
              <div className="space-y-3">
                {files.map((uploadFile) => (
                  <div
                    key={uploadFile.id}
                    className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl border border-gray-100"
                  >
                    <div className="flex-shrink-0">
                      {uploadFile.file.type === 'image/png' ? (
                        <img
                          src={uploadFile.preview}
                          alt="Preview"
                          className="w-12 h-12 object-cover rounded-lg"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                          <FileText className="h-6 w-6 text-red-600" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {uploadFile.file.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {(uploadFile.file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                      
                      {(uploadFile.status === 'uploading' || uploadFile.status === 'processing') && (
                        <div className="mt-2">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${uploadFile.progress}%` }}
                            />
                          </div>
                          <p className="text-xs text-blue-600 mt-1 font-medium">
                            {getStatusText(uploadFile.status)}
                          </p>
                        </div>
                      )}

                      {uploadFile.error && (
                        <p className="text-xs text-red-600 mt-1 flex items-center space-x-1">
                          <AlertCircle className="h-3 w-3" />
                          <span>{uploadFile.error}</span>
                        </p>
                      )}
                    </div>

                    <div className="flex-shrink-0">
                      {getStatusIcon(uploadFile.status)}
                      {uploadFile.status === 'pending' && !uploadFile.error && (
                        <button
                          onClick={() => removeFile(uploadFile.id)}
                          className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-lg transition-all duration-200"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-100 bg-gray-50 p-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-gray-600">
              {files.length > 0 && (
                <span>
                  {files.filter(f => f.status === 'success').length} / {files.length} ไฟล์สำเร็จ
                </span>
              )}
            </div>
            
            <div className="flex items-center space-x-3 w-full sm:w-auto">
              {onClose && (
                <button
                  onClick={onClose}
                  disabled={isUploading}
                  className="flex-1 sm:flex-none px-6 py-3 text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  ยกเลิก
                </button>
              )}
              
              {/* Show different buttons based on upload status */}
              {allFilesProcessed ? (
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2 text-green-600">
                    <CheckCircle className="h-5 w-5" />
                    <span className="font-semibold">อัปโหลดเสร็จสิ้น</span>
                  </div>
                  {onClose && (
                    <button
                      onClick={onClose}
                      className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-soft hover:shadow-medium transform hover:-translate-y-0.5 font-semibold"
                    >
                      ปิดหน้าต่าง
                    </button>
                  )}
                </div>
              ) : (
                <button
                  onClick={handleUpload}
                  disabled={!hasValidFiles || isUploading}
                  className="flex-1 sm:flex-none px-6 py-3 bg-gradient-to-r from-blue-600 to-teal-600 text-white rounded-xl hover:from-blue-700 hover:to-teal-700 transition-all duration-200 shadow-soft hover:shadow-medium transform hover:-translate-y-0.5 font-semibold disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none min-w-[200px]"
                >
                  {isUploading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>กำลังประมวลผล...</span>
                    </div>
                  ) : (
                    'อัปโหลดและให้ AI วิเคราะห์'
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}