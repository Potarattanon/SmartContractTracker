import { useState, useEffect } from 'react'
import { supabase, Document, DocumentInsert, DocumentUpdate } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

export function useDocuments() {
  const { user } = useAuth()
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch documents
  const fetchDocuments = async () => {
    if (!user) return

    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setDocuments(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการโหลดเอกสาร')
    } finally {
      setLoading(false)
    }
  }

  // Create document
  const createDocument = async (document: DocumentInsert) => {
    if (!user) throw new Error('ไม่พบข้อมูลผู้ใช้')

    try {
      const { data, error } = await supabase
        .from('documents')
        .insert({ ...document, user_id: user.id })
        .select()
        .single()

      if (error) throw error
      
      setDocuments(prev => [data, ...prev])
      return data
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการสร้างเอกสาร'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }

  // Update document
  const updateDocument = async (id: string, updates: DocumentUpdate) => {
    try {
      const { data, error } = await supabase
        .from('documents')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error

      setDocuments(prev => prev.map(doc => doc.id === id ? data : doc))
      return data
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการอัปเดตเอกสาร'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }

  // Delete document
  const deleteDocument = async (id: string) => {
    try {
      const { error } = await supabase
        .from('documents')
        .delete()
        .eq('id', id)

      if (error) throw error

      setDocuments(prev => prev.filter(doc => doc.id !== id))
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการลบเอกสาร'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }

  // Get document statistics
  const getDocumentStats = async () => {
    if (!user) return null

    try {
      const { data, error } = await supabase
        .rpc('get_document_stats', { user_uuid: user.id })

      if (error) throw error
      return data[0] || null
    } catch (err) {
      console.error('Error fetching document stats:', err)
      return null
    }
  }

  useEffect(() => {
    fetchDocuments()
  }, [user])

  return {
    documents,
    loading,
    error,
    fetchDocuments,
    createDocument,
    updateDocument,
    deleteDocument,
    getDocumentStats
  }
}