import React from 'react'
import { AlertTriangle, X, Trash2, FileText, Loader2 } from 'lucide-react'
import { Document, DOCUMENT_TYPE_LABELS } from '../lib/supabase'

interface DeleteDocumentModalProps {
  document: Document
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  isDeleting?: boolean
}

export function DeleteDocumentModal({ 
  document, 
  isOpen, 
  onClose, 
  onConfirm, 
  isDeleting = false 
}: DeleteDocumentModalProps) {
  if (!isOpen) return null

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'ไม่ระบุ'
    return new Date(dateString).toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-strong max-w-lg w-full max-h-[85vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">ลบเอกสาร</h3>
              <p className="text-sm text-gray-600">การดำเนินการนี้ไม่สามารถยกเลิกได้</p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Warning Message */}
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-semibold text-red-900 mb-2">
                  คุณแน่ใจหรือไม่ที่จะลบเอกสารนี้?
                </h4>
                <p className="text-sm text-red-700 leading-relaxed">
                  เอกสารจะถูกลบออกจากระบบอย่างถาวร รวมถึงไฟล์ต้นฉบับและการแจ้งเตือนที่เกี่ยวข้อง
                </p>
              </div>
            </div>
          </div>

          {/* Document Details */}
          <div className="bg-gray-50 rounded-xl p-5 mb-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                <FileText className="h-4 w-4 text-blue-600" />
              </div>
              <span className="text-base font-semibold text-gray-900">รายละเอียดเอกสาร</span>
            </div>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">ชื่อเอกสาร</p>
                <p className="text-base font-semibold text-gray-900 break-words">
                  {document.title}
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">ประเภท</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {DOCUMENT_TYPE_LABELS[document.document_type]}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">ขนาดไฟล์</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {formatFileSize(document.file_size)}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">วันหมดอายุ</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {formatDate(document.expiry_date)}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">วันที่อัปโหลด</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {formatDate(document.created_at)}
                  </p>
                </div>
              </div>
              
              <div>
                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">ชื่อไฟล์</p>
                <p className="text-sm font-medium text-gray-700 break-all bg-white px-3 py-2 rounded-lg border border-gray-200">
                  {document.file_name}
                </p>
              </div>
            </div>
          </div>

          {/* Impact List */}
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
            <div className="flex items-center space-x-2 mb-3">
              <AlertTriangle className="h-4 w-4 text-orange-600" />
              <h4 className="text-sm font-semibold text-orange-900">
                สิ่งที่จะถูกลบออกจากระบบ:
              </h4>
            </div>
            <div className="text-sm text-orange-800 space-y-2">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
                <span>ไฟล์เอกสารต้นฉบับ</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
                <span>ข้อมูลเอกสารในระบบ</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
                <span>การแจ้งเตือนที่เกี่ยวข้อง</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
                <span>ประวัติการเข้าถึง</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer - Fixed at bottom */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-100 bg-gray-50 flex-shrink-0">
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="px-6 py-3 text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ยกเลิก
          </button>
          
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-200 shadow-soft hover:shadow-medium transform hover:-translate-y-0.5 font-semibold disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isDeleting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>กำลังลบ...</span>
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4" />
                <span>ลบเอกสาร</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}