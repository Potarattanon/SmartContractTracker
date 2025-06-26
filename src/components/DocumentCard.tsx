import React from 'react'
import { FileText, Calendar, AlertTriangle, CheckCircle, Clock, Download, Eye, Trash2 } from 'lucide-react'
import { Document, DOCUMENT_TYPE_LABELS, DOCUMENT_STATUS_LABELS } from '../lib/supabase'

interface DocumentCardProps {
  document: Document
  onView?: (document: Document) => void
  onDownload?: (document: Document) => void
  onDelete?: (document: Document) => void
}

export function DocumentCard({ document, onView, onDownload, onDelete }: DocumentCardProps) {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'ไม่ระบุ'
    return new Date(dateString).toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-600 bg-green-50 border-green-200'
      case 'expiring_soon':
        return 'text-orange-600 bg-orange-50 border-orange-200'
      case 'expired':
        return 'text-red-600 bg-red-50 border-red-200'
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4" />
      case 'expiring_soon':
        return <Clock className="h-4 w-4" />
      case 'expired':
        return <AlertTriangle className="h-4 w-4" />
      default:
        return <CheckCircle className="h-4 w-4" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'lease_purchase':
        return 'text-blue-600 bg-blue-50 border-blue-200'
      case 'license':
        return 'text-purple-600 bg-purple-50 border-purple-200'
      case 'certificate':
        return 'text-emerald-600 bg-emerald-50 border-emerald-200'
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-soft border border-gray-100/50 hover:shadow-medium transition-all duration-300 group">
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-teal-500 rounded-2xl flex items-center justify-center shadow-soft">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                {document.title}
              </h3>
              <p className="text-sm text-gray-500 font-medium">
                {document.file_name}
              </p>
            </div>
          </div>

          {/* Status Badge */}
          <div className={`
            inline-flex items-center space-x-1 px-3 py-1.5 rounded-full text-xs font-semibold border
            ${getStatusColor(document.status || 'active')}
          `}>
            {getStatusIcon(document.status || 'active')}
            <span>{DOCUMENT_STATUS_LABELS[document.status || 'active']}</span>
          </div>
        </div>

        {/* Description */}
        {document.description && (
          <p className="text-sm text-gray-600 leading-relaxed mb-4">
            {document.description}
          </p>
        )}

        {/* Type Badge */}
        <div className={`
          inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold border
          ${getTypeColor(document.document_type)}
        `}>
          {DOCUMENT_TYPE_LABELS[document.document_type]}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="grid grid-cols-2 gap-4 mb-6">
          {/* Expiry Date */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-orange-50 rounded-lg flex items-center justify-center">
              <Calendar className="h-4 w-4 text-orange-600" />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                วันหมดอายุ
              </p>
              <p className="text-sm font-semibold text-gray-900">
                {formatDate(document.expiry_date)}
              </p>
            </div>
          </div>

          {/* File Size */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center">
              <FileText className="h-4 w-4 text-gray-600" />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                ขนาดไฟล์
              </p>
              <p className="text-sm font-semibold text-gray-900">
                {formatFileSize(document.file_size)}
              </p>
            </div>
          </div>
        </div>

        {/* Created Date */}
        <div className="text-xs text-gray-500 mb-6">
          อัปโหลดเมื่อ {formatDate(document.created_at)}
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2">
          {onView && (
            <button
              onClick={() => onView(document)}
              className="flex-1 flex items-center justify-center space-x-2 px-4 py-2.5 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-all duration-200 font-semibold text-sm"
            >
              <Eye className="h-4 w-4" />
              <span>ดู</span>
            </button>
          )}

          {onDownload && (
            <button
              onClick={() => onDownload(document)}
              className="flex-1 flex items-center justify-center space-x-2 px-4 py-2.5 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-100 transition-all duration-200 font-semibold text-sm"
            >
              <Download className="h-4 w-4" />
              <span>ดาวน์โหลด</span>
            </button>
          )}

          {onDelete && (
            <button
              onClick={() => onDelete(document)}
              className="px-3 py-2.5 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-all duration-200"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}