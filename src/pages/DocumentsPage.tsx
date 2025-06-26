import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useDocuments } from '../hooks/useDocuments'
import { FileUpload } from '../components/FileUpload'
import { DeleteDocumentModal } from '../components/DeleteDocumentModal'
import { NotificationBell } from '../components/NotificationBell'
import { FileText, Settings, LogOut, AlertTriangle, Plus, Search, Filter, Eye, Download, Trash2, Calendar, CheckCircle, Clock } from 'lucide-react'
import { supabase, DocumentType, DOCUMENT_TYPE_LABELS, DOCUMENT_STATUS_LABELS, Document } from '../lib/supabase'

export function DocumentsPage() {
  const { user, signOut } = useAuth()
  const { documents, loading, fetchDocuments } = useDocuments()
  const [showUpload, setShowUpload] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<DocumentType | 'all'>('all')
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'expiring_soon' | 'expired'>('all')
  
  // Delete modal state
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean
    document: Document | null
    isDeleting: boolean
  }>({
    isOpen: false,
    document: null,
    isDeleting: false
  })

  const handleSignOut = async () => {
    await signOut()
  }

  const handleUploadSuccess = (document: any) => {
    fetchDocuments()
  }

  const handleViewDocument = async (document: any) => {
    try {
      const { data } = await supabase.storage
        .from('documents')
        .createSignedUrl(document.file_path, 3600)

      if (data?.signedUrl) {
        window.open(data.signedUrl, '_blank')
      }
    } catch (error) {
      console.error('Error viewing document:', error)
    }
  }

  const handleDownloadDocument = async (document: any) => {
    try {
      const { data } = await supabase.storage
        .from('documents')
        .createSignedUrl(document.file_path, 3600)

      if (data?.signedUrl) {
        // ใช้ fetch เพื่อดาวน์โหลดไฟล์เป็น blob
        const response = await fetch(data.signedUrl)
        const blob = await response.blob()
        
        // สร้าง URL สำหรับ blob
        const blobUrl = window.URL.createObjectURL(blob)
        
        // สร้าง link element สำหรับดาวน์โหลด
        const link = window.document.createElement('a')
        link.href = blobUrl
        link.download = document.file_name
        link.style.display = 'none'
        
        // เพิ่ม link เข้าไปใน DOM ชั่วคราว
        window.document.body.appendChild(link)
        
        // คลิกเพื่อเริ่มดาวน์โหลด
        link.click()
        
        // ลบ link ออกจาก DOM และ revoke URL
        window.document.body.removeChild(link)
        window.URL.revokeObjectURL(blobUrl)
        
        console.log(`ดาวน์โหลดไฟล์สำเร็จ: ${document.file_name}`)
      }
    } catch (error) {
      console.error('Error downloading document:', error)
      alert('เกิดข้อผิดพลาดในการดาวน์โหลดไฟล์ กรุณาลองใหม่อีกครั้ง')
    }
  }

  const handleDeleteDocument = (document: Document) => {
    setDeleteModal({
      isOpen: true,
      document,
      isDeleting: false
    })
  }

  const handleConfirmDelete = async () => {
    if (!deleteModal.document) return

    setDeleteModal(prev => ({ ...prev, isDeleting: true }))

    try {
      // Delete file from storage
      await supabase.storage
        .from('documents')
        .remove([deleteModal.document.file_path])

      // Delete document record from database
      await supabase
        .from('documents')
        .delete()
        .eq('id', deleteModal.document.id)

      // Refresh documents list
      fetchDocuments()

      // Close modal
      setDeleteModal({
        isOpen: false,
        document: null,
        isDeleting: false
      })
    } catch (error) {
      console.error('Error deleting document:', error)
      setDeleteModal(prev => ({ ...prev, isDeleting: false }))
    }
  }

  const handleCloseDeleteModal = () => {
    if (!deleteModal.isDeleting) {
      setDeleteModal({
        isOpen: false,
        document: null,
        isDeleting: false
      })
    }
  }

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.file_name.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesType = filterType === 'all' || doc.document_type === filterType
    const matchesStatus = filterStatus === 'all' || doc.status === filterStatus

    return matchesSearch && matchesType && matchesStatus
  })

  const getStatusCount = (status: string) => {
    return documents.filter(doc => doc.status === status).length
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'ไม่ระบุ'
    return new Date(dateString).toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'short',
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
    <div className="min-h-screen bg-gray-50/50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-gray-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-teal-600 rounded-xl flex items-center justify-center shadow-soft">
                <FileText className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">
                  Smart Contract Tracker
                </h1>
                <p className="text-xs text-gray-500 font-medium">ยินดีต้อนรับ, {user?.email}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <NotificationBell />
              <Link
                to="/settings"
                className="p-2.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all duration-200"
                title="ตั้งค่า"
              >
                <Settings className="h-4 w-4" />
              </Link>
              <button
                onClick={handleSignOut}
                className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all duration-200 font-medium"
              >
                <LogOut className="h-4 w-4" />
                <span>ออกจากระบบ</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            เอกสารทั้งหมด
          </h2>
          <p className="text-gray-600 font-medium">
            จัดการเอกสารสัญญาและติดตามวันหมดอายุของคุณ
          </p>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex space-x-3">
            <Link
              to="/dashboard"
              className="bg-gradient-to-r from-indigo-100 to-blue-100 text-indigo-700 px-4 py-2 rounded-xl font-semibold hover:from-indigo-200 hover:to-blue-200 hover:text-indigo-800 transition-all duration-200 text-sm border border-indigo-200/50 hover:border-indigo-300/50 shadow-soft hover:shadow-medium transform hover:-translate-y-0.5"
            >
              แดชบอร์ด
            </Link>
            <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-xl font-semibold text-sm shadow-soft hover:shadow-medium transform hover:-translate-y-0.5 transition-all duration-200">
              เอกสารทั้งหมด
            </button>
          </div>

          <button
            onClick={() => setShowUpload(true)}
            className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-teal-600 text-white px-4 py-2 rounded-xl hover:from-blue-700 hover:to-teal-700 transition-all duration-200 shadow-soft hover:shadow-medium transform hover:-translate-y-0.5 font-semibold text-sm"
          >
            <Plus className="h-4 w-4" />
            <span>เพิ่มเอกสาร</span>
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          <div className="bg-gradient-to-br from-teal-50 to-blue-50 p-4 rounded-xl border border-teal-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-teal-500 uppercase tracking-wide">เอกสารทั้งหมด</p>
                <p className="text-xl font-bold text-teal-600 mt-1">{documents.length}</p>
              </div>
              <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center">
                <FileText className="h-4 w-4 text-teal-600" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-xl border border-green-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-green-500 uppercase tracking-wide">เอกสารปกติ</p>
                <p className="text-xl font-bold text-green-600 mt-1">{getStatusCount('active')}</p>
              </div>
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="h-4 w-4 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-red-50 p-4 rounded-xl border border-orange-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-orange-500 uppercase tracking-wide">ใกล้หมดอายุ</p>
                <p className="text-xl font-bold text-orange-600 mt-1">{getStatusCount('expiring_soon')}</p>
              </div>
              <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                <Clock className="h-4 w-4 text-orange-600" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-red-50 to-pink-50 p-4 rounded-xl border border-red-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-red-500 uppercase tracking-wide">หมดอายุแล้ว</p>
                <p className="text-xl font-bold text-red-600 mt-1">{getStatusCount('expired')}</p>
              </div>
              <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                <AlertTriangle className="h-4 w-4 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white p-6 rounded-2xl shadow-soft border border-gray-100/50 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="ค้นหาเอกสาร..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                />
              </div>
            </div>

            <div className="md:w-48">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as DocumentType | 'all')}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              >
                <option value="all">ประเภททั้งหมด</option>
                {Object.entries(DOCUMENT_TYPE_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>

            <div className="md:w-48">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              >
                <option value="all">สถานะทั้งหมด</option>
                <option value="active">เอกสารปกติ</option>
                <option value="expiring_soon">ใกล้หมดอายุ</option>
                <option value="expired">หมดอายุแล้ว</option>
              </select>
            </div>
          </div>
        </div>

        {/* Documents Table */}
        <div className="bg-white rounded-2xl shadow-soft border border-gray-100/50 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900">
              เอกสารทั้งหมด ({filteredDocuments.length})
            </h3>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <FileText className="h-8 w-8 text-gray-400 animate-pulse" />
              </div>
              <p className="text-gray-600 font-medium">กำลังโหลด...</p>
            </div>
          ) : filteredDocuments.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700 uppercase tracking-wide">
                      เอกสาร
                    </th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700 uppercase tracking-wide">
                      ประเภท
                    </th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700 uppercase tracking-wide">
                      สถานะ
                    </th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700 uppercase tracking-wide">
                      วันหมดอายุ
                    </th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700 uppercase tracking-wide">
                      ขนาดไฟล์
                    </th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700 uppercase tracking-wide">
                      วันที่อัปโหลด
                    </th>
                    <th className="text-center py-4 px-6 text-sm font-semibold text-gray-700 uppercase tracking-wide">
                      การจัดการ
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredDocuments.map((document) => (
                    <tr key={document.id} className="hover:bg-gray-50/50 transition-colors duration-200">
                      {/* Document Info */}
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-teal-500 rounded-xl flex items-center justify-center shadow-soft">
                            <FileText className="h-5 w-5 text-white" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-semibold text-gray-900 truncate">
                              {document.title}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                              {document.file_name}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Type */}
                      <td className="py-4 px-6">
                        <div className={`
                          inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border
                          ${getTypeColor(document.document_type)}
                        `}>
                          {DOCUMENT_TYPE_LABELS[document.document_type]}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-6">
                        <div className={`
                          inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-semibold border
                          ${getStatusColor(document.status || 'active')}
                        `}>
                          {getStatusIcon(document.status || 'active')}
                          <span>{DOCUMENT_STATUS_LABELS[document.status || 'active']}</span>
                        </div>
                      </td>

                      {/* Expiry Date */}
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span className="text-sm font-medium text-gray-900">
                            {formatDate(document.expiry_date)}
                          </span>
                        </div>
                      </td>

                      {/* File Size */}
                      <td className="py-4 px-6">
                        <span className="text-sm font-medium text-gray-900">
                          {formatFileSize(document.file_size)}
                        </span>
                      </td>

                      {/* Created Date */}
                      <td className="py-4 px-6">
                        <span className="text-sm text-gray-600">
                          {formatDate(document.created_at)}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-6">
                        <div className="flex items-center justify-center space-x-2">
                          <button
                            onClick={() => handleViewDocument(document)}
                            className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-all duration-200"
                            title="ดูเอกสาร"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          
                          <button
                            onClick={() => handleDownloadDocument(document)}
                            className="p-2 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-all duration-200"
                            title="ดาวน์โหลด"
                          >
                            <Download className="h-4 w-4" />
                          </button>
                          
                          <button
                            onClick={() => handleDeleteDocument(document)}
                            className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-200"
                            title="ลบเอกสาร"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <FileText className="h-8 w-8 text-gray-400" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                {documents.length === 0 ? 'ยังไม่มีเอกสาร' : 'ไม่พบเอกสารที่ค้นหา'}
              </h4>
              <p className="text-gray-600 mb-8 font-medium max-w-sm mx-auto">
                {documents.length === 0 
                  ? 'เริ่มต้นด้วยการอัปโหลดเอกสารแรกของคุณ แค่เลือกไฟล์และตั้งเวลาแจ้งเตือน'
                  : 'ลองเปลี่ยนคำค้นหาหรือตัวกรองเพื่อหาเอกสารที่ต้องการ'
                }
              </p>
              <button
                onClick={() => setShowUpload(true)}
                className="bg-gradient-to-r from-blue-600 to-teal-600 text-white px-8 py-3 rounded-xl hover:from-blue-700 hover:to-teal-700 transition-all duration-200 shadow-soft hover:shadow-medium transform hover:-translate-y-0.5 font-semibold"
              >
                อัปโหลดเอกสารแรก
              </button>
            </div>
          )}
        </div>
      </main>

      {/* File Upload Modal */}
      {showUpload && (
        <FileUpload
          onUploadSuccess={handleUploadSuccess}
          onClose={() => setShowUpload(false)}
        />
      )}

      {/* Delete Document Modal */}
      {deleteModal.document && (
        <DeleteDocumentModal
          document={deleteModal.document}
          isOpen={deleteModal.isOpen}
          onClose={handleCloseDeleteModal}
          onConfirm={handleConfirmDelete}
          isDeleting={deleteModal.isDeleting}
        />
      )}
    </div>
  )
}